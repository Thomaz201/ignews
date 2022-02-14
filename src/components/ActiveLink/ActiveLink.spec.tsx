import { render, RenderResult } from '@testing-library/react'
import { ActiveLink } from './'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('Active Link component tests', () => {
  it('should render correctly', () => {
    const documentBody: RenderResult = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    const homeAnchorElement = documentBody.getByText('Home')

    expect(homeAnchorElement).toBeInTheDocument()
  })

  it('should receive active class if link is currently active', () => {
    const documentBody: RenderResult = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    const homeAnchorElement = documentBody.getByText('Home')

    expect(homeAnchorElement).toHaveClass('active')
  })

  it('should not receive any class if the link is not active', () => {
    const documentBody: RenderResult = render(
      <ActiveLink href="/teste" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    const homeAnchorElement = documentBody.getByText('Home')

    expect(homeAnchorElement).not.toHaveClass()
  })
})