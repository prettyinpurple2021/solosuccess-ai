import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { PrivacyPolicy } from './PrivacyPolicy';

describe('PrivacyPolicy', () => {
    it('renders heading', () => {
        render(<PrivacyPolicy />);
        const heading = screen.getByRole('heading', { name: /privacy policy/i });
        expect(heading).toBeInTheDocument();
    });
});
