import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../shared/services/book.service';
import { Book } from '../../shared/app.state';
import { WishlistService } from '../../shared/services/wishlist.service';

@Component({
  selector: 'app-book-library',
  templateUrl: './book-library.component.html',
  styleUrls: ['./book-library.component.scss'],
})
export class BookLibraryComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    public wishlistService: WishlistService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(
      (books) => {
        this.books = books.map((book) => ({
          ...book,
          inWishlist: this.wishlistService.isBookInWishlist(book),
        }));
      },
      (error) => {
        console.error('Error fetching books:', error);
      },
    );
  }

  goToBookDetails(book: Book): void {
    const workId = book.id.startsWith('/works/') ? book.id.slice(7) : book.id;
    if (workId) {
      this.bookService.getBookDetails(workId).subscribe(
        (details) => {
          this.bookService.setSelectedBook(details);
          this.router.navigate(['/book-details']);
        },
        (error) => {
          console.error('Error fetching book details:', error);
        },
      );
    } else {
      console.error('Book ID is missing.');
    }
  }

  goToAuthorDetails(authorKey: string): void {
    const authorId = authorKey.split('/').pop(); // Extract the actual author ID
    this.router.navigate(['/author-details', authorId]);
  }
  toggleWishlist(book: Book): void {
    if (this.wishlistService.isBookInWishlist(book)) {
      this.wishlistService.removeFromWishlist(book);
    } else {
      this.wishlistService.addToWishlist(book);
    }
    book.inWishlist = !book.inWishlist;
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
