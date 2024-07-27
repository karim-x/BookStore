import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { BookLibraryComponent } from './book-library.component';
import { BookService } from '../../shared/services/book.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { Book } from '../../shared/app.state';
import { provideHttpClient } from '@angular/common/http';

describe('BookLibraryComponent', () => {
  let component: BookLibraryComponent;
  let fixture: ComponentFixture<BookLibraryComponent>;
  let bookServiceStub: Partial<BookService>;
  let wishlistServiceStub: Partial<WishlistService>;

  beforeEach(async () => {
    const books: Book[] = [
      {
        id: '1', title: 'Test Book', authors: [{ name: 'Author 1', key: '/authors/A1' }], publishDate: '2023-01-01', coverUrl: 'path/to/cover',
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
          is_browseable: false
        }
      },
      // Add more books as needed
    ];

    bookServiceStub = {
      getBooks: () => of(books),
      getBookDetails: () => of(books[0]),
      // Add missing method stubs if necessary
      setSelectedBook: jasmine.createSpy('setSelectedBook'),
    };

    wishlistServiceStub = {
      isBookInWishlist: () => false,
      addToWishlist: jasmine.createSpy('addToWishlist'),
      removeFromWishlist: jasmine.createSpy('removeFromWishlist'),
    };

    await TestBed.configureTestingModule({
      declarations: [BookLibraryComponent],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: BookService, useValue: bookServiceStub },
        { provide: WishlistService, useValue: wishlistServiceStub },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch books on init', () => {
    expect(component.books.length).toBe(1);
  });

  it('should call addToWishlist when toggling wishlist for a book not in wishlist', () => {
    const book: Book = component.books[0];
    component.toggleWishlist(book);
    expect(wishlistServiceStub.addToWishlist).toHaveBeenCalledWith(book);
  });

  it('should navigate to book details', () => {
    const navigateSpy = spyOn((component as any).router, 'navigate');
    component.goToBookDetails(component.books[0]);
    expect(navigateSpy).toHaveBeenCalledWith(['/book-details']);
  });
});
