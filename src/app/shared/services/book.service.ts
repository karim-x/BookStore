import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Book } from '../app.state';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly apiUrl = 'https://openlibrary.org/subjects/finance.json';
  private readonly workApiUrl = 'https://openlibrary.org/works/';
  private readonly authorApiUrl = 'https://openlibrary.org/authors/';
  private readonly defaultCoverUrl =
    'https://via.placeholder.com/150?text=No+Cover';
  private readonly searchApiUrl = 'https://openlibrary.org/search.json';

  private selectedBookSubject = new BehaviorSubject<Book | null>(null);
  selectedBook$ = this.selectedBookSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSelectedBook(book: Book): void {
    this.selectedBookSubject.next(book);
    localStorage.setItem('selectedBook', JSON.stringify(book));
  }

  getSelectedBook(): Book | null {
    const book = this.selectedBookSubject.getValue();
    if (!book) {
      const storedBook = localStorage.getItem('selectedBook');
      if (storedBook) {
        return JSON.parse(storedBook);
      }
    }
    return book;
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((data) => {
        return data.works.slice(0, 9).map((work: any) => ({
          id: work.key, // Use the work's key as the unique identifier
          coverUrl: work.cover_id
            ? `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`
            : this.defaultCoverUrl,
          publishDate: work.first_publish_year || 'Unknown',
          authors: Array.isArray(work.authors)
            ? work.authors
            : [{ name: 'Unknown Author' }],
          title: work.title,
          edition_count: work.edition_count,
          number_of_pages: work.number_of_pages || 0,
          first_publish_year: work.first_publish_year || 'Unknown',
          subject: work.subject || [],
          ia_collection: work.ia_collection || [],
          lendinglibrary: work.lendinglibrary ?? false,
          printdisabled: work.printdisabled ?? false,
          lending_edition: work.lending_edition || '',
          lending_identifier: work.lending_identifier || '',
          ia: work.ia || '',
          public_scan: work.public_scan ?? false,
          has_fulltext: work.has_fulltext ?? false,
          availability: work.availability || {
            status: '',
            available_to_browse: false,
            available_to_borrow: false,
            available_to_waitlist: false,
            is_printdisabled: false,
            is_readable: false,
            is_lendable: false,
            is_previewable: false,
            identifier: '',
            isbn: null,
            oclc: null,
            openlibrary_work: '',
            openlibrary_edition: '',
            last_loan_date: null,
            num_waitlist: null,
            last_waitlist_date: null,
            is_restricted: false,
            is_browseable: false,
          },
        }));
      }),
    );
  }

  getBookDetails(workId: string): Observable<Book> {
    return this.http.get<any>(`${this.workApiUrl}${workId}.json`).pipe(
      switchMap((work) => {
        const bookDetails: Partial<Book> = {
          id: work.key,
          coverUrl: work.covers
            ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`
            : this.defaultCoverUrl,
          publishDate: work.first_publish_year || 'Unknown',
          authors: work.authors
            ? work.authors.map((author: any) => ({
                name: `Author ID: ${author.author.key.split('/').pop()}`,
              }))
            : [{ name: 'Unknown Author' }],
          title: work.title,
          first_publish_year:
            typeof work.created.value === 'string'
              ? parseInt(work.created.value, 10)
              : work.created.value.getFullYear(),
          subject: work.subjects ? work.subjects : [],
          ia_collection: [],
          lendinglibrary: false,
          printdisabled: false,
          lending_edition: '',
          lending_identifier: '',
          ia: '',
          public_scan: false,
          has_fulltext: false,
          availability: {
            status: '',
            available_to_browse: false,
            available_to_borrow: false,
            available_to_waitlist: false,
            is_printdisabled: false,
            is_readable: false,
            is_lendable: false,
            is_previewable: false,
            identifier: '',
            isbn: null,
            oclc: null,
            openlibrary_work: '',
            openlibrary_edition: '',
            last_loan_date: null,
            num_waitlist: null,
            last_waitlist_date: null,
            is_restricted: false,
            is_browseable: false,
          },
        };

        if (work.edition_count !== undefined) {
          bookDetails.edition_count = work.edition_count;
          bookDetails.number_of_pages = 0; // or fetch number of pages from another source if needed
          return new Observable<Book>((observer) => {
            observer.next(bookDetails as Book);
            observer.complete();
          });
        } else {
          // Fetch editions to get the edition count
          return this.http
            .get<any>(`${this.workApiUrl}${workId}/editions.json`)
            .pipe(
              map((editions) => {
                bookDetails.edition_count = editions.size;
                bookDetails.number_of_pages = 0; // or fetch number of pages from another source if needed
                return bookDetails as Book;
              }),
            );
        }
      }),
    );
  }
  getAuthorDetails(authorId: string): Observable<any> {
    return this.http.get<any>(`${this.authorApiUrl}${authorId}.json`).pipe(
      map((author) => ({
        name: author.name,
        image: author.photos
          ? `https://covers.openlibrary.org/b/id/${author.photos[0]}-L.jpg`
          : this.defaultCoverUrl,
        birthdate: author.birth_date,
        topWork: author.works ? author.works[0].title : 'Unknown',
        workCount: author.works ? author.works.length : 0,
        topSubjects: author.subjects ? author.subjects.slice(0, 5) : [],
      })),
    );
  }
  searchBooks(query: string, field: string): Observable<Book[]> {
    const searchUrl = `${this.searchApiUrl}?${field}=${query}`;
    return this.http.get<any>(searchUrl).pipe(
      map((data) => {
        return data.docs.slice(0, 9).map((doc: any) => ({
          id: doc.key,
          coverUrl: doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : this.defaultCoverUrl,
          publishDate: doc.first_publish_year || 'Unknown',
          authors: doc.author_name
            ? doc.author_name.map((name: string) => ({ key: '', name }))
            : [{ key: '', name: 'Unknown Author' }],
          title: doc.title,
          edition_count: doc.edition_count || 0,
          number_of_pages: doc.number_of_pages || 0,
          first_publish_year: doc.first_publish_year || 'Unknown',
          subject: doc.subject || [],
          ia_collection: [],
          lendinglibrary: false,
          printdisabled: false,
          lending_edition: '',
          lending_identifier: '',
          ia: '',
          public_scan: false,
          has_fulltext: false,
          availability: {
            status: '',
            available_to_browse: false,
            available_to_borrow: false,
            available_to_waitlist: false,
            is_printdisabled: false,
            is_readable: false,
            is_lendable: false,
            is_previewable: false,
            identifier: '',
            isbn: null,
            oclc: null,
            openlibrary_work: '',
            openlibrary_edition: '',
            last_loan_date: null,
            num_waitlist: null,
            last_waitlist_date: null,
            is_restricted: false,
            is_browseable: false,
          },
        }));
      }),
    );
  }
}
