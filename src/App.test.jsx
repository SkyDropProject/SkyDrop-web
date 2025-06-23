import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
	localStorage.clear();
});

describe('App', () => {
	it('renders login form when not logged in', () => {
		render(<App />);
		expect(screen.getByText('Connexion')).toBeInTheDocument();
	});

	it('shows signup form when clicking "S\'inscrire"', () => {
		render(<App />);
		fireEvent.click(screen.getByText("S'inscrire"));
		expect(screen.getByText('Inscription')).toBeInTheDocument();
	});

	it('renders product list when user is logged in', async () => {
		localStorage.setItem('user', JSON.stringify({ token: 'fake-token', username: 'test' }));
		render(<App />);
		// Attends un texte visible typique de la liste produits
		const productHeader = await screen.findByText((content) =>
			content.toLowerCase().includes('liste des produits')
		);
		expect(productHeader).toBeInTheDocument();
	});
});
