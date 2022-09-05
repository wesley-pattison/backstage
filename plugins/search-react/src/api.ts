/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import useAsync from 'react-use/lib/useAsync';
import { SearchQuery, SearchResultSet } from '@backstage/plugin-search-common';
import { createApiRef, useApi } from '@backstage/core-plugin-api';

/**
 * @public
 */
export const searchApiRef = createApiRef<SearchApi>({
  id: 'plugin.search.queryservice',
});

/**
 * @public
 */
export interface SearchApi {
  query(query: SearchQuery): Promise<SearchResultSet>;
}

/**
 * @public
 *
 * Search Api Mock that can be used in tests and storybooks
 */
export class MockSearchApi implements SearchApi {
  constructor(public mockedResults?: SearchResultSet) {}

  query(): Promise<SearchResultSet> {
    return Promise.resolve(this.mockedResults || { results: [] });
  }
}

/**
 * @public
 * Performs a search query and returns search results.
 * @param query - object containing term, types, filters and pageCursor properties.
 * @returns an async state for the query request, containing error, loading and value properties.
 */
export const useSearchResults = (query: Partial<SearchQuery>) => {
  const searchApi = useApi(searchApiRef);
  return useAsync(() => {
    const { term = '', types = [], filters = {}, ...rest } = query;
    return searchApi.query({
      term,
      types,
      filters,
      ...rest,
    });
  }, [query]);
};
