import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductList from './ProductList';
import axios from 'axios';

vi.mock('axios');

const mockProducts = [
	{ _id: '1', name: 'Produit 1', description: 'Desc', price: 10, stock: 5, weight: 500 },
	{ _id: '2', name: 'Produit 2', description: 'Desc', price: 20, stock: 3, weight: 800 },
];

describe('ProductList', () => {
	beforeEach(() => {
		localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
		axios.get.mockResolvedValue({ data: [] }); // empty cart
	});

	it('renders product names', async () => {
		render(<ProductList products={mockProducts} />);
		expect(await screen.findByText('Produit 1')).toBeInTheDocument();
		expect(screen.getByText('Produit 2')).toBeInTheDocument();
	});

	it('disables add button if stock is 0', async () => {
		const outOfStockProduct = [{ ...mockProducts[0], stock: 0 }];
		render(<ProductList products={outOfStockProduct} />);
		const addButton = await screen.findByText('+');
		expect(addButton).toBeDisabled();
	});
});
