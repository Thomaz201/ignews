import { render, RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic')
jest.mock('next/router')
jest.mock('next-auth/client')

describe('Post preview page tests', () => {
  const useSessionMocked = mocked(useSession);
  const useRouterMocked = mocked(useRouter);
  const getPrismicClientMocked = mocked(getPrismicClient);

  const mockedPost = {
    slug: 'my-new-post',
    title: 'My new post',
    content: '<p>Post content</p>',
    updatedAt: '8 de setembro'
  }

  it('should render the page correctly', () => {
    useSessionMocked.mockReturnValueOnce([null, false])

    const documentBody: RenderResult = render(
      <Post post={mockedPost} />
    )

    const postTitleElement = documentBody.getByText('My new post')
    const buttonElement = documentBody.getByText('Want to continue reading?')

    expect(postTitleElement).toBeInTheDocument()
    expect(buttonElement).toBeInTheDocument()
  })

  it('should redirect user to full post when user is subscribed', async () => {
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: 'fake-active-subscribtion'
    }, false])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <Post post={mockedPost} />
    )

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')
  })

  it('should load initial data', async () => {
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
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
              text: 'Post content'
            }
          ]
        },
        last_publication_date: '02-16-2022'
      })
    } as any)

    const response = await getStaticProps({
      req: {
        cookies: {}
      },
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updatedAt: '16 de fevereiro de 2022'
          }
        }
      })
    )
  })
})


