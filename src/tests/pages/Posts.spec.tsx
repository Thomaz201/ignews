import { render, RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic')
jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

describe('Posts page tests', () => {
  it('should render the page correctly', () => {
    const mockedPosts = [
      {
        slug: 'my-new-post',
        title: 'My new post',
        excerpt: 'Post excerpt',
        updatedAt: '8 de setembro'
      }
    ]

    const documentBody: RenderResult = render(
      <Posts posts={mockedPosts} />
    )

    const postTitleElement = documentBody.getByText('My new post')

    expect(postTitleElement).toBeInTheDocument()
  })

  it('should load initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                {
                  type: 'heading',
                  text: 'My new post'
                }
              ],
              content: [
                {
                  type: 'paragraph',
                  text: 'Post excerpt'
                }
              ]
            },
            last_publication_date: '02-16-2022'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post',
              excerpt: 'Post excerpt',
              updatedAt: '16 de fevereiro de 2022'
            }
          ]
        }
      })
    )
  })
})