import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CoalGame } from './CoalGame';

describe('CoalGame', () => {
  it('keeps everything in one game and unlocks the polishing tab after carving', async () => {
    const user = userEvent.setup();

    render(<CoalGame />);

    expect(screen.getByRole('tab', { name: 'Đập than' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toBeDisabled();

    const coalPiece = screen.getByTestId('coal-piece');

    const drag = (distance: number) => {
      act(() => {
        fireEvent.pointerDown(coalPiece, { pointerId: 1, clientX: 0, clientY: 0 });
        fireEvent.pointerMove(coalPiece, { pointerId: 1, clientX: distance, clientY: 0 });
        fireEvent.pointerUp(coalPiece, { pointerId: 1 });
      });
    };

    for (let index = 0; index < 5; index += 1) {
      drag(510); // 510px to safely exceed 500px
    }

    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).not.toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toHaveAttribute('aria-selected', 'true');

    for (let index = 0; index < 8; index += 1) {
      drag(510);
    }

    expect(screen.getByText('Sản phẩm đã hoàn thiện với bề mặt bóng gương.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Làm lại' }));

    expect(screen.getByRole('tab', { name: 'Đập than' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Đánh bóng' })).toBeDisabled();
  });
});
