import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SearchComponent } from './search.component';
import { BookService } from '../../shared/services/book.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Import HttpClientTestingModule here
import { Book } from '../../shared/app.state'; // Ensure this import is correct

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let bookServiceStub: Partial<BookService>;

  beforeEach(async () => {
    // Define a Book object according to the Book interface
    const books: Book[] = [
      {
        id: '1',
        title: 'Test Book',
        authors: [{ name: 'Author 1', key: '/authors/A1' }],
        publishDate: '2023-01-01',
        coverUrl: 'path/to/cover',
        name: undefined,
        edition_count: 0,
        number_of_pages: 0,
        first_publish_year: '',
        subject: [],
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
      },
    ];

    bookServiceStub = {
      searchBooks: (query: string, field: string) => of(books),
    };

    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule, // Ensure HttpClientTestingModule is imported
      ],
      providers: [
        { provide: BookService, useValue: bookServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.searchQuery).toBe('');
    expect(component.searchField).toBe('title');
    expect(component.books).toEqual([]);
    expect(component.errorMessage).toBe('');
  });

  it('should call searchBooks and set books when searchBooks is successful', () => {
    const books: Book[] = [
      {
        id: '1',
        title: 'Test Book',
        authors: [{ name: 'Author 1', key: '/authors/A1' }],
        publishDate: '2023-01-01',
        coverUrl: 'path/to/cover',
        name: undefined,
        edition_count: 0,
        number_of_pages: 0,
        first_publish_year: '',
        subject: [],
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
      },
    ];

    bookServiceStub.searchBooks = (query: string, field: string) => of(books);
    component.searchQuery = 'Test';
    component.searchBooks();

    fixture.detectChanges();

    expect(component.books).toEqual(books);
    expect(component.errorMessage).toBe('');
  });

  it('should handle error and set errorMessage when searchBooks fails', () => {
    bookServiceStub.searchBooks = (query: string, field: string) => throwError(() => new Error('Search failed'));
    component.searchQuery = 'Test';
    component.searchBooks();

    fixture.detectChanges();

    expect(component.books).toEqual([]);
    expect(component.errorMessage).toBe('An error occurred while searching for books. Please try again.');
  });
});
