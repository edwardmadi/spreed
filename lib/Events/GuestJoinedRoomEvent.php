<?php

declare(strict_types=1);
/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

namespace OCA\Talk\Events;

use OCA\Talk\Participant;
use OCA\Talk\Room;

class GuestJoinedRoomEvent extends ARoomEvent {
	public function __construct(
		Room $room,
		protected Participant $participant,
	) {
		parent::__construct($room);
	}

	public function getParticipant(): Participant {
		return $this->participant;
	}
}
