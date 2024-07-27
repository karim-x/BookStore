import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AuthorDetailsComponent } from './author-details.component';
import { BookService } from '../../shared/services/book.service';
import { convertToParamMap } from '@angular/router';

// Create a mock ActivatedRouteSnapshot
class MockActivatedRouteSnapshot implements ActivatedRouteSnapshot {
  get title(): string | undefined {
    throw new Error('Method not implemented.');
  }
  get queryParamMap(): ParamMap {
    throw new Error('Method not implemented.');
  }
  toString(): string {
    throw new Error('Method not implemented.');
  }
  // Provide the required properties
  paramMap: ParamMap = convertToParamMap({ id: '123' });
  url: any[] = [];
  params: { [key: string]: string } = {};
  queryParams: { [key: string]: string } = {};
  fragment: string | null = null;
  data: { [key: string]: any } = {};
  outlet: string = '';
  component: any = null;
  routeConfig: any = null;
  root: ActivatedRouteSnapshot = this;
  parent: ActivatedRouteSnapshot | null = null;
  firstChild: ActivatedRouteSnapshot | null = null;
  children: ActivatedRouteSnapshot[] = [];
  pathFromRoot: ActivatedRouteSnapshot[] = [];
}

describe('AuthorDetailsComponent', () => {
  let component: AuthorDetailsComponent;
  let fixture: ComponentFixture<AuthorDetailsComponent>;
  let bookServiceStub: Partial<BookService>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(async () => {
    const author = {
      name: 'Author Name',
      image: 'path/to/image',
      birthdate: '2000-01-01',
      topWork: 'Famous Book',
      workCount: 10,
      topSubjects: ['Science', 'Literature']
    };

    bookServiceStub = {
      getAuthorDetails: () => of(author)
    };

    activatedRouteStub = {
      snapshot: new MockActivatedRouteSnapshot()
    };

    await TestBed.configureTestingModule({
      declarations: [AuthorDetailsComponent],
      providers: [
        { provide: BookService, useValue: bookServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch author details on init', () => {
    expect(component.author).toBeTruthy();
    expect(component.author.name).toBe('Author Name');
  });
});
