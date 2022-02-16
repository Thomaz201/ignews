import { render, RenderResult } from '@testing-library/react'
import { mocked } from 'jest-mock';
import Home, { getStaticProps } from '../../pages/index'
import { stripe } from '../../services/Stripe';

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false]
    }
  }
})

jest.mock('next/router')
jest.mock('../../services/Stripe')

describe('Home page tests', () => {
  it('should render the page correctly', () => {
    const mockedProduct = {
      priceId: 'test-price-id',
      amount: '$19.90'
    }

    const documentBody: RenderResult = render(
      <Home product={mockedProduct} />
    )

    const pageElement = documentBody.getByText(/\$19.90/i)

    expect(pageElement).toBeInTheDocument()
  })

  it('should load initial data', async () => {
    const stripePricesRetrieveMocked = mocked(stripe.prices.retrieve)

    stripePricesRetrieveMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})