import { Component, OnInit } from '@angular/core';
import { BookService } from '../../shared/services/book.service';
import { Book } from '../../shared/app.state';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchField: string = 'title';
  books: Book[] = [];
  errorMessage: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {}

  searchBooks(): void {
    if (this.searchQuery.trim()) {
      this.bookService
        .searchBooks(this.searchQuery, this.searchField)
        .subscribe(
          (books) => {
            this.books = books;
            this.errorMessage = '';
          },
          (error) => {
            this.errorMessage =
              'An error occurred while searching for books. Please try again.';
            console.error('Error searching for books:', error);
          },
        );
    } else {
      this.errorMessage = 'Please enter a search query.';
    }
  }

  getAuthorNames(book: Book): string {
    return book.authors.map((a) => a.name).join(', ');
  }
}
