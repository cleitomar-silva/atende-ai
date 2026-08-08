<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TicketNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $message,
        public int $ticketId,
        public int $ticketNumber,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'ticket_id' => $this->ticketId,
            'ticket_number' => $this->ticketNumber,
        ];
    }
}