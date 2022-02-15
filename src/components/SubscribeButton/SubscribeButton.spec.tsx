import { render, RenderResult, fireEvent } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/client'
import { useRouter, NextRouter } from "next/router"
import { mocked } from 'jest-mock'
import { SubscribeButton } from './'

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscribeButton component tests', () => {
  const useSessionMocked = mocked(useSession);
  const signInMocked = mocked(signIn);
  const useRouterMocked = mocked(useRouter);

  it('should render correctly', () => {
    useSessionMocked.mockReturnValueOnce([null, false])

    const documentBody: RenderResult = render(
      <SubscribeButton />
    )

    const buttonElement = documentBody.getByText('Subscribe now')

    expect(buttonElement).toBeInTheDocument()
  })

  it('should redirect user to sign in when not authenticated', () => {
    useSessionMocked.mockReturnValueOnce([null, false])

    const documentBody: RenderResult = render(
      <SubscribeButton />
    )

    const buttonElement = documentBody.getByText('Subscribe now')

    fireEvent.click(buttonElement)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('should redirect to posts when user already has a subscription', () => {
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'John Doe',
        email: 'johndoe@example.com'
      },
      activeSubscription: 'fake-subscription',
      expires: 'fake-expires'
    }, false])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    const documentBody: RenderResult = render(
      <SubscribeButton />
    )

    const buttonElement = documentBody.getByText('Subscribe now')

    fireEvent.click(buttonElement)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})