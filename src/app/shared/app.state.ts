export interface Book {
  name: any;
  id: string;
  coverUrl: string;
  publishDate: string;
  authors: { key: string; name: string }[];
  title: string;
  edition_count: number;
  number_of_pages: number;
  first_publish_year: number | string;
  subject: string[];
  ia_collection: string[];
  lendinglibrary: boolean;
  printdisabled: boolean;
  lending_edition: string;
  lending_identifier: string;
  ia: string;
  public_scan: boolean;
  has_fulltext: boolean;
  availability: {
    status: string;
    available_to_browse: boolean;
    available_to_borrow: boolean;
    available_to_waitlist: boolean;
    is_printdisabled: boolean;
    is_readable: boolean;
    is_lendable: boolean;
    is_previewable: boolean;
    identifier: string;
    isbn: string | null;
    oclc: string | null;
    openlibrary_work: string;
    openlibrary_edition: string;
    last_loan_date: string | null;
    num_waitlist: number | null;
    last_waitlist_date: string | null;
    is_restricted: boolean;
    is_browseable: boolean;
  };
  inWishlist?: boolean; // New property
}
