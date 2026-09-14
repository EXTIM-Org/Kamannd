import { NextResponse } from 'next/server';

const API_KEY = "sk_mb_rCuRVGgDk-UyCHkrnfTgORwAwGyQF";
const BASE_URL = "http://82.115.21.96:4000/public/v1/products/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const min_price = searchParams.get('min_price');
  const max_price = searchParams.get('max_price');
  const brand = searchParams.get('brand');
  const in_stock = searchParams.get('in_stock');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  const url = new URL(BASE_URL);
  url.searchParams.append('q', query);
  if (min_price) url.searchParams.append('min_price', min_price);
  if (max_price) url.searchParams.append('max_price', max_price);
  if (brand) url.searchParams.append('brand', brand);
  if (in_stock) url.searchParams.append('in_stock', in_stock);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'x-api-key': API_KEY,
      },
      next: { revalidate: 60 } // Cache API results for 60 seconds
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json({ error: 'Failed to fetch data', details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
