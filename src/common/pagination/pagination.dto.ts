/**
 * Shared class for build URL
 */
class BasePagination<T> {
  protected buildUrl(
    page: number,
    route: string,
    query: Record<string, any> = {},
  ): string {
    const params = new URLSearchParams({
      ...query,
      page: page.toString(),
    });
    return `${route}?${params.toString()}`;
  }
}
/**
 * For basic pagination
 * return (page,pages,count,results)
 */

export class MetaPaginationDto<T> {
  constructor(
    public page: number,
    public pages: number,
    public count: number,
    public results: T[],
  ) {}
}

/**
 * For Links pagination
 * return (count,next,prev,results)
 */
export class LinkPaginationDto<T> extends BasePagination<T> {
  count: number;
  next: string | null;
  prev: string | null;
  results: T[];

  constructor(
    page: number,
    pages: number,
    count: number,
    route: string,
    query: Record<string, any> = {},
    results: T[],
  ) {
    super();
    this.count = count;
    this.results = results;

    const hasNext = page < pages;
    const hasPrev = page > 1;

    this.next = hasNext ? this.buildUrl(page + 1, route, query) : null;
    this.prev = hasPrev ? this.buildUrl(page - 1, route, query) : null;
  }
}

/**
 * For full  pagination
 * return (page,pages,count,next,prev,results)
 */
export class FullPaginationDto<T> extends BasePagination<T> {
  page: number;
  pages: number;
  count: number;
  next: string | null;
  prev: string | null;
  results: T[];

  constructor(
    page: number,
    pages: number,
    count: number,
    route: string,
    query: Record<string, any> = {},
    results: T[],
  ) {
    super();
    this.page = page;
    this.pages = pages;
    this.count = count;
    this.results = results;

    const hasNext = page < pages;
    const hasPrev = page > 1;

    this.next = hasNext ? this.buildUrl(page + 1, route, query) : null;
    this.prev = hasPrev ? this.buildUrl(page - 1, route, query) : null;
  }
}
