import { Component, OnInit } from '@angular/core';
import { WishlistService } from '../../shared/services/wishlist.service';
import { Book } from '../../shared/app.state';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  wishlist: Book[] = [];

  constructor(private wishlistService: WishlistService) {}

  ngOnInit(): void {
    this.wishlist = this.wishlistService.getWishlist();
  }

  removeFromWishlist(book: Book): void {
    if (
      confirm(
        `Are you sure you want to remove "${book.title}" from your wishlist?`,
      )
    ) {
      this.wishlistService.removeFromWishlist(book);
      this.wishlist = this.wishlistService.getWishlist();
    }
  }

  getAuthorNames(book: Book): string {
    return book.authors.map((a) => a.name).join(', ');
  }
}
