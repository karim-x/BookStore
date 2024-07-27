import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../../shared/services/book.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { Book } from '../../shared/app.state';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  isInWishlist: boolean = false;

  constructor(
    private router: Router,
    private bookService: BookService,
    private wishlistService: WishlistService,
  ) {}

  ngOnInit(): void {
    this.book = this.bookService.getSelectedBook();

    if (!this.book) {
      console.error('No book data found in state or service.');
      this.router.navigate(['/books']);
    } else {
      this.isInWishlist = this.wishlistService.isBookInWishlist(this.book);
    }
  }

  toggleWishlist(): void {
    if (this.book) {
      if (this.isInWishlist) {
        this.wishlistService.removeFromWishlist(this.book);
      } else {
        this.wishlistService.addToWishlist(this.book);
      }
      this.isInWishlist = !this.isInWishlist;
    }
  }
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
