import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../shared/app.state';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistSubject = new BehaviorSubject<Book[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor() {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlistSubject.next(JSON.parse(storedWishlist));
    }
  }

  getWishlist(): Book[] {
    return this.wishlistSubject.getValue();
  }

  addToWishlist(book: Book): void {
    const wishlist = this.getWishlist();
    if (!wishlist.find((b) => b.id === book.id)) {
      wishlist.push(book);
      this.updateWishlist(wishlist);
    }
  }

  removeFromWishlist(book: Book): void {
    const wishlist = this.getWishlist().filter((b) => b.id !== book.id);
    this.updateWishlist(wishlist);
  }

  updateWishlist(wishlist: Book[]): void {
    this.wishlistSubject.next(wishlist);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  isBookInWishlist(book: Book): boolean {
    return this.getWishlist().some((b) => b.id === book.id);
  }
}
