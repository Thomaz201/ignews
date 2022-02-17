import { render, RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic';

jest.mock('../../services/prismic')
jest.mock('next/router')
jest.mock('next-auth/client')

describe('Post page tests', () => {
  it('should render the page correctly', () => {
    const mockedPost = {
      slug: 'my-new-post',
      title: 'My new post',
      content: '<p>Post content</p>',
      updatedAt: '8 de setembro'
    }

    const documentBody: RenderResult = render(
      <Post post={mockedPost} />
    )

    const postTitleElement = documentBody.getByText('My new post')
    const postContentElement = documentBody.getByText('Post content')

    expect(postTitleElement).toBeInTheDocument()
    expect(postContentElement).toBeInTheDocument()
  })

  it('should redirect user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      req: {
        cookies: {}
      },
      params: {
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    )
  })

  it('should load initial data', async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    })

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

    const response = await getServerSideProps({
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


