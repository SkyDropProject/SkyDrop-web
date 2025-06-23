import { render, screen, waitFor } from '@testing-library/react';
import ProductImage from './ProductImage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

vi.mock('axios');

describe('ProductImage', () => {
	beforeEach(() => {
		localStorage.setItem('user', JSON.stringify({ token: 'test-token' }));
	});

	it('displays image after successful fetch', async () => {
		const blob = new Blob(['fake image'], { type: 'image/png' });
		const fakeUrl = 'blob:http://localhost/fakeurl';
		global.URL.createObjectURL = vi.fn(() => fakeUrl);
		global.URL.revokeObjectURL = vi.fn();

		axios.get.mockResolvedValue({ data: blob });

		render(<ProductImage imageUrl="image.png" alt="Produit" />);

		// Attendre que l’image soit rendue avec alt="Produit"
		const img = await screen.findByRole('img', { name: /produit/i });
		expect(img).toHaveAttribute('src', fakeUrl);
	});

	it('shows loading initially', () => {
		render(<ProductImage imageUrl="image.png" />);
		expect(screen.getByText(/loading image/i)).toBeInTheDocument();
	});

	it('shows error on failure', async () => {
		axios.get.mockRejectedValue(new Error('Failed'));
		render(<ProductImage imageUrl="image.png" />);
		const errorMsg = await screen.findByText(/image failed to load/i);
		expect(errorMsg).toBeInTheDocument();
	});
});
