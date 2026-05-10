import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CoalGame } from './CoalGame';

describe('CoalGame', () => {
  it('keeps everything in one game and unlocks the polishing tab after carving', async () => {
    const user = userEvent.setup();

    render(<CoalGame />);

    expect(screen.getByRole('tab', { name: 'Đập than' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toBeDisabled();

    const carveButton = screen.getByRole('button', { name: 'Đập' });

    for (let index = 0; index < 5; index += 1) {
      await user.click(carveButton);
    }

    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toHaveAttribute('aria-selected', 'true');

    const polishButton = screen.getByRole('button', { name: 'Đánh bóng' });

    for (let index = 0; index < 8; index += 1) {
      await user.click(polishButton);
    }

    expect(screen.getByText('Sản phẩm đã hoàn thiện với bề mặt bóng gương.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Làm lại' }));

    expect(screen.getByRole('tab', { name: 'Đập than' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toBeDisabled();
  });
});
