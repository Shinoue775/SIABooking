
    // Guest counters
    let adults = 2;
    let kids = 0;
    let infants = 0;
    let extraBeds = 0;
    let roomType = 'standard';
    let pwdDiscount = false;
    let seniorDiscount = false;
    let pwdDiscountCount = 0;
    let seniorDiscountCount = 0;
    let hasRealRoomData = false;

    // Calendar Variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedCheckIn = null;
    let selectedCheckOut = null;

    const BOOKING_API_BASE = "http://127.0.0.1:3001";
    let unavailableDates = [];
    const dailyRates = {
        standard: 2500,
        deluxe: 4500,
    };
    const roomCatalog = {
        standard: { id: null, name: 'Standard Room B', tags: ['Standard'], raw: null },
        deluxe: { id: null, name: 'Deluxe Room A', tags: ['Deluxe'], raw: null },
    };
    let selectedAmenities = [];

    const roomRates = dailyRates;
    const EXTRA_BED_PRICE = 700;
    const SERVICE_CHARGE = 85;
    const DISCOUNT_RATE = 0.20;
    let pendingBookingPayload = null;
    let pendingBookingTotal = 0;
    let pendingBookingAmount = 0;
    let pendingPaymentAmountPaid = 0;
    let pendingPaymentBalance = 0;
    let pendingPaymentOption = 'partial';
    let pendingReceiptFile = null;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const BASELINE_MONTH = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let availabilityRequestToken = 0;

    function formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function getTodayAtMidnight() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    function getEligibleGuestCount() {
        return adults + kids + infants;
    }

    function updateRoomDataNotice() {
        const notice = document.getElementById('roomTypeDataNotice');
        if (!notice) return;
        notice.classList.toggle('hidden', hasRealRoomData);
    }

    function applyRoomAvailabilityState() {
        const optionMap = [
            { key: 'standard', optionId: 'roomOptionStandard' },
            { key: 'deluxe', optionId: 'roomOptionDeluxe' },
        ];
        let firstAvailableType = null;
        optionMap.forEach(({ key, optionId }) => {
            const option = document.getElementById(optionId);
            const input = option?.querySelector('input[name="roomType"]');
            const available = Boolean(roomCatalog[key]?.id);
            if (!option || !input) return;
            option.style.display = available ? '' : 'none';
            input.disabled = !available;
            if (available && !firstAvailableType) firstAvailableType = key;
        });

        hasRealRoomData = Boolean(firstAvailableType);
        if (!hasRealRoomData) {
            unavailableDates = [];
            updateRoomDataNotice();
            renderCalendar();
            return;
        }

        if (!roomCatalog[roomType]?.id) {
            roomType = firstAvailableType;
            const activeInput = document.querySelector(`input[name="roomType"][value="${roomType}"]`);
            if (activeInput) activeInput.checked = true;
        }
        updateRoomDataNotice();
        filterRoomTypes();
    }

    function syncRoomSummary() {
        const activeRoom = roomCatalog[roomType];
        const roomPrice = roomRates[roomType] || 0;
        document.getElementById('summaryRoom').innerText = activeRoom?.name || 'Selected Room';
        document.getElementById('summaryRoomPrice').innerHTML = `₱${roomPrice.toLocaleString()} / night`;
    }

    function renderRoomCard(type) {
        const room = roomCatalog[type];
        if (!room) return;
        const labelEl = document.getElementById(type === 'standard' ? 'roomLabelStandard' : 'roomLabelDeluxe');
        const priceEl = document.getElementById(type === 'standard' ? 'roomPriceStandard' : 'roomPriceDeluxe');
        const tagsEl = document.getElementById(type === 'standard' ? 'roomTagsStandard' : 'roomTagsDeluxe');
        if (labelEl) labelEl.innerText = room.name;
        if (priceEl) priceEl.innerText = `₱${(roomRates[type] || 0).toLocaleString()}`;
        if (tagsEl) {
            tagsEl.innerHTML = '';
            (room.tags || []).forEach((tag) => {
                const span = document.createElement('span');
                span.className = 'text-xs bg-gray-100 px-2 py-1 rounded';
                span.innerText = tag;
                tagsEl.appendChild(span);
            });
        }
    }

    async function loadRoomsFromBackend() {
        try {
            const response = await fetch(`${BOOKING_API_BASE}/api/rooms`);
            if (!response.ok) {
                hasRealRoomData = false;
                applyRoomAvailabilityState();
                return;
            }
            const rooms = await response.json();
            const sorted = Array.isArray(rooms) ? rooms : [];
            const roomAssignments = { standard: null, deluxe: null };
            sorted.forEach((room) => {
                const normalizedType = String(room.type || room.category || room.name || room.room_name || '').toLowerCase();
                const preferredKey = normalizedType.includes('deluxe') ? 'deluxe' : 'standard';
                if (!roomAssignments[preferredKey]) {
                    roomAssignments[preferredKey] = room;
                } else if (!roomAssignments[preferredKey === 'deluxe' ? 'standard' : 'deluxe']) {
                    roomAssignments[preferredKey === 'deluxe' ? 'standard' : 'deluxe'] = room;
                }
            });

            Object.entries(roomAssignments).forEach(([key, room]) => {
                if (!room) {
                    roomCatalog[key].id = null;
                    return;
                }
                roomCatalog[key].id = room.id ?? null;
                roomCatalog[key].name = room.name || room.room_name || room.room_number || roomCatalog[key].name;
                roomCatalog[key].raw = room;
                roomCatalog[key].tags = [room.type || room.category || key];
                const roomPrice = Number(room.price_per_night ?? room.rate ?? room.price ?? room.base_price);
                if (!Number.isNaN(roomPrice) && roomPrice > 0) {
                    roomRates[key] = roomPrice;
                }
                renderRoomCard(key);
            });
            applyRoomAvailabilityState();
            syncRoomSummary();
            updateSummary();
            await refreshAvailabilityForMonth();
        } catch (_error) {
            hasRealRoomData = false;
            applyRoomAvailabilityState();
            renderCalendar();
        }
    }

    function roomMatchesSelection(candidate, selectedRoomId, selectedRoomType) {
        const candidateId = String(candidate.id ?? '');
        const normalizedType = String(candidate.type || candidate.category || candidate.room_type || candidate.name || candidate.room_name || candidate.room_number || '').toLowerCase();
        const normalizedSelection = String(selectedRoomType || '').toLowerCase();

        if (selectedRoomId && candidateId === String(selectedRoomId)) {
            return true;
        }

        if (normalizedSelection && normalizedType.includes(normalizedSelection)) {
            return true;
        }

        return false;
    }

    function addUnavailableDatesRange(startDate, endDate) {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const addedDates = new Set(unavailableDates);

        while (start < end) {
            addedDates.add(formatLocalDate(start));
            start.setDate(start.getDate() + 1);
        }

        unavailableDates = Array.from(addedDates).sort();
    }

    async function refreshAvailabilityForMonth() {
        const selectedRoomId = roomCatalog[roomType]?.id;
        const selectedRoomType = roomType;
        if (!selectedRoomId && !selectedRoomType) {
            unavailableDates = [];
            renderCalendar();
            return;
        }

        const requestToken = ++availabilityRequestToken;
        unavailableDates = [];
        renderCalendar();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const checks = Array.from({ length: daysInMonth }, (_, index) => {
            const dateValue = formatLocalDate(new Date(currentYear, currentMonth, index + 1));
            return fetch(`${BOOKING_API_BASE}/api/rooms/availability?date=${dateValue}`)
                .then((response) => (response.ok ? response.json() : null))
                .then((payload) => {
                    const rooms = Array.isArray(payload?.rooms) ? payload.rooms : [];
                    const matchingRooms = rooms.filter((candidate) => roomMatchesSelection(candidate, selectedRoomId, selectedRoomType));
                    return matchingRooms.some((room) => room.available === false) ? dateValue : null;
                })
                .catch(() => null);
        });

        const results = await Promise.all(checks);
        if (requestToken !== availabilityRequestToken) return;
        unavailableDates = results.filter(Boolean);
        renderCalendar();
    }

    function filterRoomTypes() {
        const query = (document.getElementById('roomTypeSearch')?.value || '').trim().toLowerCase();
        const options = Array.from(document.querySelectorAll('.room-option'));
        let matches = 0;
        options.forEach((option) => {
            const input = option.querySelector('input[name="roomType"]');
            const isEnabled = input ? !input.disabled : true;
            const show = isEnabled && (!query || option.textContent.toLowerCase().includes(query));
            option.style.display = show ? '' : 'none';
            if (show) matches += 1;
        });
        document.getElementById('roomTypeEmpty')?.classList.toggle('hidden', matches > 0);
    }

    function getAmenitiesTotalPerNight() {
        return selectedAmenities.reduce((total, amenity) => total + (Number(amenity.price) || 0), 0);
    }

    function updateGuestCount(type, delta) {
        if (type === 'adults') {
            const newValue = adults + delta;
            if (newValue >= 1 && newValue <= 4 - kids) {
                adults = newValue;
                document.getElementById('adultsCount').innerText = adults;
            }
        } else if (type === 'kids') {
            const newValue = kids + delta;
            if (newValue >= 0 && newValue <= 4 - adults) {
                kids = newValue;
                document.getElementById('kidsCount').innerText = kids;
            }
        } else if (type === 'infants') {
            const newValue = infants + delta;
            if (newValue >= 0 && newValue <= 2) {
                infants = newValue;
                document.getElementById('infantsCount').innerText = infants;
            }
        }
        updateDiscountGuestControls();
        updateSummary();
    }

    function updateExtraBeds(delta) {
        const newValue = extraBeds + delta;
        if (newValue >= 0 && newValue <= 2) {
            extraBeds = newValue;
            document.getElementById('extraBedsCount').innerText = extraBeds;
            updateSummary();
        }
    }

    function updateDiscounts(selected) {
        const pwdCheckbox = document.getElementById('pwdDiscount');
        const seniorCheckbox = document.getElementById('seniorDiscount');
        const clearBtn = document.getElementById('clearDiscountBtn');
        
        if (selected === 'pwd') {
            pwdDiscount = pwdCheckbox.checked;
            if (!pwdDiscount) {
                pwdDiscountCount = 0;
            } else if (pwdDiscountCount < 1) {
                pwdDiscountCount = 1;
            }
        } else if (selected === 'senior') {
            seniorDiscount = seniorCheckbox.checked;
            if (!seniorDiscount) {
                seniorDiscountCount = 0;
            } else if (seniorDiscountCount < 1) {
                seniorDiscountCount = 1;
            }
        }
        
        if (pwdDiscount || seniorDiscount) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }

        updateDiscountGuestControls();
        updateSummary();
    }

    function updateDiscountGuestCount(type, delta) {
        const totalGuests = Math.max(getEligibleGuestCount(), 1);
        if (type === 'pwd' && pwdDiscount) {
            const maxPwd = Math.max(totalGuests - seniorDiscountCount, 1);
            pwdDiscountCount = Math.min(Math.max(pwdDiscountCount + delta, 1), maxPwd);
            document.getElementById('pwdDiscountCount').innerText = String(pwdDiscountCount);
        }
        if (type === 'senior' && seniorDiscount) {
            const maxSenior = Math.max(totalGuests - pwdDiscountCount, 1);
            seniorDiscountCount = Math.min(Math.max(seniorDiscountCount + delta, 1), maxSenior);
            document.getElementById('seniorDiscountCount').innerText = String(seniorDiscountCount);
        }
        updateDiscountGuestControls();
        updateSummary();
    }

    function updateDiscountGuestControls() {
        const maxEligible = Math.max(getEligibleGuestCount(), 1);
        const pwdControls = document.getElementById('pwdDiscountControls');
        const seniorControls = document.getElementById('seniorDiscountControls');
        const pwdLimitText = document.getElementById('pwdDiscountLimitText');
        const seniorLimitText = document.getElementById('seniorDiscountLimitText');

        if (pwdControls) {
            pwdControls.classList.toggle('hidden', !pwdDiscount);
            if (pwdLimitText) pwdLimitText.innerText = `Max: ${maxEligible}`;
            const countEl = document.getElementById('pwdDiscountCount');
            if (countEl) countEl.innerText = String(pwdDiscountCount || (pwdDiscount ? 1 : 0));
        }

        if (seniorControls) {
            seniorControls.classList.toggle('hidden', !seniorDiscount);
            if (seniorLimitText) seniorLimitText.innerText = `Max: ${maxEligible}`;
            const countEl = document.getElementById('seniorDiscountCount');
            if (countEl) countEl.innerText = String(seniorDiscountCount || (seniorDiscount ? 1 : 0));
        }
    }

    function clearDiscounts() {
        const pwdCheckbox = document.getElementById('pwdDiscount');
        const seniorCheckbox = document.getElementById('seniorDiscount');
        const clearBtn = document.getElementById('clearDiscountBtn');
        
        // Uncheck both checkboxes
        pwdCheckbox.checked = false;
        seniorCheckbox.checked = false;
        
        // Reset discount flags
        pwdDiscount = false;
        seniorDiscount = false;
        pwdDiscountCount = 0;
        seniorDiscountCount = 0;
        
        // Hide clear button
        clearBtn.classList.add('hidden');
        updateDiscountGuestControls();
        // Update summary
        updateSummary();
    }

    document.querySelectorAll('input[name="roomType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            roomType = this.value;
            syncRoomSummary();
            refreshAvailabilityForMonth();
            updateSummary();
        });
    });

    function renderCalendar() {
        const calendarDays = document.getElementById('calendarDays');
        if (!calendarDays) return;

        const currentMonthYear = document.getElementById('currentMonthYear');
        if (currentMonthYear) {
            currentMonthYear.innerHTML = `${monthNames[currentMonth]} ${currentYear}`;
        }

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        calendarDays.innerHTML = '';

        const totalCells = 42;

        for (let i = 0; i < totalCells; i++) {
            const dayNumber = i - firstDay + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            let displayDate = null;
            let isDisabled = false;
            let dateStr = null;

            if (isCurrentMonth) {
                displayDate = new Date(currentYear, currentMonth, dayNumber);
                dateStr = formatLocalDate(displayDate);
            }

            const today = getTodayAtMidnight();
            const todayStr = formatLocalDate(today);
            const isToday = isCurrentMonth && dateStr === todayStr;
            const isPast = isCurrentMonth && displayDate < today;
            const isUnavailable = isCurrentMonth && unavailableDates.includes(dateStr);
            const isCheckIn = isCurrentMonth && selectedCheckIn === dateStr;
            const isCheckOut = isCurrentMonth && selectedCheckOut === dateStr;

            let isInRange = false;
            if (selectedCheckIn && selectedCheckOut && !isCheckIn && !isCheckOut) {
                const checkInDate = new Date(selectedCheckIn);
                const checkOutDate = new Date(selectedCheckOut);
                isInRange = isCurrentMonth && displayDate > checkInDate && displayDate < checkOutDate;
            }

            isDisabled = isPast || isUnavailable;

            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';

            if (!isCurrentMonth) {
                dayDiv.classList.add('empty');
                calendarDays.appendChild(dayDiv);
                continue;
            }

            if (isUnavailable) dayDiv.classList.add('unavailable');
            if (isDisabled && !isUnavailable) dayDiv.classList.add('disabled');
            if (isCheckIn) dayDiv.classList.add('selected-start');
            if (isCheckOut) dayDiv.classList.add('selected-end');
            if (isInRange) dayDiv.classList.add('in-range');
            if (isToday && !isCheckIn && !isCheckOut) dayDiv.classList.add('today');

            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.innerText = Math.abs(dayNumber);
            dayNumberSpan.style.fontWeight = '500';
            dayDiv.appendChild(dayNumberSpan);

            if (isCurrentMonth && !isPast && !isUnavailable && Math.abs(dayNumber) <= daysInMonth) {
                const priceBadge = document.createElement('span');
                const rate = dailyRates[roomType] || 2500;
                priceBadge.className = 'price-badge';
                priceBadge.innerText = `₱${rate}`;
                dayDiv.appendChild(priceBadge);
            }

            if (isInRange) {
                const indicator = document.createElement('span');
                indicator.className = 'range-indicator';
                dayDiv.appendChild(indicator);
            }

            if (isUnavailable) {
                dayDiv.title = 'Booked / Unavailable';
            } else if (isPast) {
                dayDiv.title = 'Past date';
            }

            if (!isDisabled) {
                dayDiv.style.cursor = 'pointer';
                dayDiv.onclick = () => selectDate(displayDate);
            }

            calendarDays.appendChild(dayDiv);
        }
        updateCalendarNavigationButtons();
    }

    function selectDate(date) {
        const dateStr = formatLocalDate(date);
        const today = getTodayAtMidnight();

        if (date < today) {
            return;
        }

        if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
            selectedCheckIn = dateStr;
            selectedCheckOut = null;
            updateDateInputs();
        } else if (selectedCheckIn && !selectedCheckOut) {
            const checkInDate = new Date(selectedCheckIn);

            if (date > checkInDate) {
                selectedCheckOut = dateStr;
            } else if (date < checkInDate) {
                selectedCheckIn = dateStr;
                selectedCheckOut = null;
            }
            updateDateInputs();
        }

        renderCalendar();
    }

    function updateDateInputs() {
        const checkInDisplay = document.getElementById('selectedCheckIn');
        const checkOutDisplay = document.getElementById('selectedCheckOut');
        const nightsSummary = document.getElementById('nightsSummary');
        const totalNightsSpan = document.getElementById('totalNights');
        window.selectedCheckIn = selectedCheckIn;
        window.selectedCheckOut = selectedCheckOut;

        if (selectedCheckIn) {
            const checkInDate = new Date(selectedCheckIn);
            checkInDisplay.innerHTML = checkInDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            const checkInInput = document.getElementById('checkInDate');
            if (checkInInput) checkInInput.value = selectedCheckIn;
        } else {
            checkInDisplay.innerHTML = 'Not selected';
            const checkInInput = document.getElementById('checkInDate');
            if (checkInInput) checkInInput.value = '';
        }

        if (selectedCheckOut) {
            const checkOutDate = new Date(selectedCheckOut);
            checkOutDisplay.innerHTML = checkOutDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            const checkOutInput = document.getElementById('checkOutDate');
            if (checkOutInput) checkOutInput.value = selectedCheckOut;

            const nights = calculateNights(selectedCheckIn, selectedCheckOut);
            totalNightsSpan.innerHTML = nights;
            nightsSummary.classList.remove('hidden');

            window.checkInDate = selectedCheckIn;
            window.checkOutDate = selectedCheckOut;
            if (typeof updateSummary === 'function') updateSummary();
            if (typeof updateDateSummary === 'function') updateDateSummary();
        } else {
            checkOutDisplay.innerHTML = 'Not selected';
            const checkOutInput = document.getElementById('checkOutDate');
            if (checkOutInput) checkOutInput.value = '';
            nightsSummary.classList.add('hidden');
            window.checkOutDate = null;
        }

        if (typeof updateDateSummary === 'function') updateDateSummary();
    }

    function calculateNights(checkIn, checkOut) {
        if (!checkIn || !checkOut) return 0;
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate - inDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function formatDate(dateString) {
        if (!dateString) return 'Not selected';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function updateAmenitiesSummary() {
        const summaryText = document.getElementById('amenitiesSummaryText');
        if (!summaryText) return;
        if (selectedAmenities.length === 0) {
            summaryText.innerText = 'Select amenities';
            return;
        }
        const amenitiesTotal = getAmenitiesTotalPerNight();
        summaryText.innerText = `${selectedAmenities.length} selected${amenitiesTotal > 0 ? ` (+₱${amenitiesTotal}/night)` : ''}`;
    }

    function bindAmenitiesHandlers() {
        document.getElementById('amenitiesToggle')?.addEventListener('click', () => {
            const panel = document.getElementById('amenitiesPanel');
            const toggle = document.getElementById('amenitiesToggle');
            const icon = document.getElementById('amenitiesToggleIcon');
            if (!panel || !toggle) return;
            const isHidden = panel.classList.toggle('hidden');
            toggle.setAttribute('aria-expanded', String(!isHidden));
            if (icon) icon.classList.toggle('rotate-180', !isHidden);
        });

        document.querySelectorAll('.amenityOption').forEach((input) => {
            input.addEventListener('change', () => {
                selectedAmenities = Array.from(document.querySelectorAll('.amenityOption:checked')).map((checkbox) => ({
                    name: checkbox.value,
                    price: Number(checkbox.dataset.price || 0),
                }));
                updateAmenitiesSummary();
                updateSummary();
            });
        });
    }

    document.getElementById('prevMonth')?.addEventListener('click', () => {
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        if (prevMonthDate < BASELINE_MONTH) {
            return;
        }
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        refreshAvailabilityForMonth();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        refreshAvailabilityForMonth();
    });

    function updateSummary() {
        const nights = (selectedCheckIn && selectedCheckOut) ? calculateNights(selectedCheckIn, selectedCheckOut) : 1;
        const rate = roomRates[roomType] || 0;
        const roomTotal = rate * nights;
        const extraBedsTotal = extraBeds * EXTRA_BED_PRICE * nights;
        const amenitiesTotal = getAmenitiesTotalPerNight() * nights;
        const subtotal = roomTotal + extraBedsTotal + amenitiesTotal;

        const eligibleGuests = Math.max(getEligibleGuestCount(), 1);
        const activePwdGuests = pwdDiscount ? Math.min(pwdDiscountCount, eligibleGuests) : 0;
        const activeSeniorGuests = seniorDiscount ? Math.min(seniorDiscountCount, eligibleGuests - activePwdGuests) : 0;
        const effectiveDiscountGuests = activePwdGuests + activeSeniorGuests;
        const perPersonShare = subtotal / eligibleGuests;
        const discountAmount = effectiveDiscountGuests > 0 ? Math.round(perPersonShare * DISCOUNT_RATE * effectiveDiscountGuests) : 0;
        const discountedSubtotal = subtotal - discountAmount;
        const total = discountedSubtotal + SERVICE_CHARGE;

        document.getElementById('summaryAdults').innerHTML = `Adults: ${adults}`;
        document.getElementById('summaryKids').innerHTML = `Kids (3-12): ${kids}`;
        document.getElementById('summaryInfants').innerHTML = `Infants (0-2): ${infants} (free)`;
        document.getElementById('summaryExtraBeds').innerHTML = `Extra Beds: ${extraBeds}`;
        document.getElementById('summaryAmenitiesList').innerHTML = `Amenities: ${selectedAmenities.length ? selectedAmenities.map((item) => item.name).join(', ') : 'None'}`;

        document.getElementById('costRoomRate').innerHTML = `₱${roomTotal.toLocaleString()}`;
        document.getElementById('costExtraBeds').innerHTML = `₱${extraBedsTotal.toLocaleString()}`;
        document.getElementById('costAmenities').innerHTML = `₱${amenitiesTotal.toLocaleString()}`;
        document.getElementById('costSubtotal').innerHTML = `₱${subtotal.toLocaleString()}`;

        const discountRow = document.getElementById('discountRow');
        const costDiscount = document.getElementById('costDiscount');
        
        if (effectiveDiscountGuests > 0) {
            discountRow.style.display = 'flex';
            const discountLabel = `Discount (20% × ${effectiveDiscountGuests} guest${effectiveDiscountGuests !== 1 ? 's' : ''})`;
            document.querySelector('#discountRow span:first-child').innerHTML = discountLabel;
            costDiscount.innerHTML = `-₱${discountAmount.toLocaleString()}`;
        } else {
            discountRow.style.display = 'none';
        }

        document.getElementById('totalAmount').innerHTML = `₱${total.toLocaleString()}`;
    }

    const fileNameSpan = document.getElementById('paymentReceiptName');

    function updateCalendarNavigationButtons() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        if (prevButton) {
            const disabled = prevMonthDate < BASELINE_MONTH;
            prevButton.disabled = disabled;
            prevButton.classList.toggle('opacity-50', disabled);
            prevButton.classList.toggle('cursor-not-allowed', disabled);
        }
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    if (fileNameSpan) {
        fileNameSpan.classList.add('hidden');
    }

    function openPaymentModal(data) {
        const paymentModal = document.getElementById('paymentModal');
        const bookingDetails = document.getElementById('paymentBookingDetails');
        const partialAmount = document.getElementById('paymentPartialAmount');
        const fullAmount = document.getElementById('paymentFullAmount');
        const receiptName = document.getElementById('paymentReceiptName');
        const receiptInput = document.getElementById('paymentReceiptFile');

        if (!paymentModal || !bookingDetails || !partialAmount || !fullAmount || !receiptName || !receiptInput) {
            return;
        }

        pendingBookingTotal = data.total;
        pendingBookingAmount = data.partialAmount;
        pendingPaymentAmountPaid = data.partialAmount;
        pendingPaymentBalance = data.total - data.partialAmount;
        pendingPaymentOption = 'partial';
        pendingReceiptFile = null;

        partialAmount.textContent = `₱${data.partialAmount.toLocaleString()}`;
        fullAmount.textContent = `₱${data.total.toLocaleString()}`;
        receiptName.textContent = '';
        receiptName.classList.add('hidden');
        receiptInput.value = '';
        const paymentAmountInput = document.getElementById('paymentAmountInput');
        if (paymentAmountInput) {
            paymentAmountInput.value = data.partialAmount;
            paymentAmountInput.min = data.partialAmount;
            paymentAmountInput.max = data.total;
        }

        const discountSummary = [];
        if (data.pwdDiscount) discountSummary.push(`${data.pwdDiscountCount || 1} PWD`);
        if (data.seniorDiscount) discountSummary.push(`${data.seniorDiscountCount || 1} Senior`);
        const discountText = discountSummary.length ? discountSummary.join(' + ') : 'None';

        bookingDetails.innerHTML = `
            <div class="grid grid-cols-2 gap-3">
                <div class="font-semibold">Guest</div><div>${data.fullName}</div>
                <div class="font-semibold">Email</div><div>${data.email}</div>
                <div class="font-semibold">Contact</div><div>${data.contact}</div>
                <div class="font-semibold">Room</div><div>${data.roomName} (${data.roomType})</div>
                <div class="font-semibold">Dates</div><div>${data.checkIn} to ${data.checkOut}</div>
                <div class="font-semibold">Nights</div><div>${data.nights}</div>
                <div class="font-semibold">Guests</div><div>${data.adults} Adults, ${data.kids} Kids, ${data.infants} Infants</div>
                <div class="font-semibold">Discount</div><div>${discountText}</div>
                <div class="font-semibold">Amenities</div><div>${data.amenities.length ? data.amenities.map((item) => item.name || item).join(', ') : 'None'}</div>
            </div>
        `;

        selectPaymentOption('partial');
        updatePaymentAmountInfo();
        paymentModal.classList.remove('hidden');
        paymentModal.classList.add('flex');
        updateCalendarNavigationButtons();
    }

    function closePaymentModal() {
        const paymentModal = document.getElementById('paymentModal');
        if (!paymentModal) return;
        paymentModal.classList.add('hidden');
        paymentModal.classList.remove('flex');
    }

    function selectPaymentOption(option) {
        const partialButton = document.getElementById('paymentOptionPartial');
        const fullButton = document.getElementById('paymentOptionFull');
        const paymentAmountInput = document.getElementById('paymentAmountInput');

        pendingPaymentOption = option;
        pendingBookingAmount = option === 'partial' ? Math.ceil(pendingBookingTotal / 2) : pendingBookingTotal;

        if (paymentAmountInput) {
            paymentAmountInput.min = pendingBookingAmount;
            paymentAmountInput.max = pendingBookingTotal;
            paymentAmountInput.value = pendingBookingAmount;
        }

        if (partialButton && fullButton) {
            partialButton.classList.toggle('border-green-600', option === 'partial');
            partialButton.classList.toggle('bg-green-50', option === 'partial');
            fullButton.classList.toggle('border-green-600', option === 'full');
            fullButton.classList.toggle('bg-green-50', option === 'full');
        }

        updatePaymentAmountInfo();
    }

    function formatCurrency(value) {
        return `₱${Number(value).toLocaleString()}`;
    }

    function updatePaymentAmountInfo() {
        const paymentAmountInput = document.getElementById('paymentAmountInput');
        const paymentAmountHint = document.getElementById('paymentAmountHint');
        const paymentBalanceText = document.getElementById('paymentBalanceText');
        const amount = paymentAmountInput ? Number(paymentAmountInput.value || 0) : 0;
        const total = pendingBookingTotal;
        const minAmount = pendingPaymentOption === 'partial' ? Math.ceil(total / 2) : total;

        pendingPaymentAmountPaid = amount;
        pendingPaymentBalance = Math.max(total - amount, 0);

        if (paymentAmountInput) {
            paymentAmountInput.min = minAmount;
            paymentAmountInput.max = total;
        }
        if (paymentAmountHint) {
            paymentAmountHint.textContent = pendingPaymentOption === 'partial'
                ? `Minimum ${formatCurrency(minAmount)}. Remaining balance due on arrival.`
                : `Enter the total amount of ${formatCurrency(total)}.`;
        }
        if (paymentBalanceText) {
            paymentBalanceText.textContent = pendingPaymentOption === 'partial'
                ? `Balance due on arrival: ${formatCurrency(pendingPaymentBalance)}`
                : (pendingPaymentBalance > 0 ? `Amount remaining: ${formatCurrency(pendingPaymentBalance)}` : 'No balance due.');
        }
    }

    function handlePaymentReceiptFile(file) {
        const paymentReceiptName = document.getElementById('paymentReceiptName');
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!file || !validTypes.includes(file.type)) {
            alert('Please upload PNG, JPG, or PDF file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Receipt file must be less than 5MB');
            return;
        }

        pendingReceiptFile = file;
        if (paymentReceiptName) {
            paymentReceiptName.textContent = `✅ ${file.name}`;
            paymentReceiptName.classList.remove('hidden');
        }
    }

    async function submitPaymentConfirmation() {
        if (!pendingReceiptFile) {
            alert('Please upload your GCash receipt before continuing.');
            return;
        }

        const paymentAmountInput = document.getElementById('paymentAmountInput');
        const amount = paymentAmountInput ? Number(paymentAmountInput.value || 0) : 0;
        const minAmount = pendingPaymentOption === 'partial' ? Math.ceil(pendingBookingTotal / 2) : pendingBookingTotal;

        if (!amount || amount <= 0) {
            alert('Please enter the amount paid via GCash.');
            return;
        }
        if (amount < minAmount) {
            alert(`For ${pendingPaymentOption === 'partial' ? 'partial' : 'full'} payment, the minimum amount is ${formatCurrency(minAmount)}.`);
            return;
        }
        if (amount > pendingBookingTotal) {
            alert('The amount paid cannot exceed the total booking amount.');
            return;
        }
        if (pendingPaymentOption === 'full' && amount !== pendingBookingTotal) {
            alert(`Full payment must be exactly ${formatCurrency(pendingBookingTotal)}.`);
            return;
        }

        pendingPaymentAmountPaid = amount;
        pendingPaymentBalance = Math.max(pendingBookingTotal - amount, 0);

        if (pendingBookingPayload) {
            pendingBookingPayload.amount_paid = pendingPaymentAmountPaid;
            pendingBookingPayload.balance_due = pendingPaymentBalance;
            pendingBookingPayload.payment_choice = pendingPaymentOption;
        }

        setPaymentLoading(true);
        await processBooking();
    }

    function setPaymentLoading(isLoading) {
        const paymentModal = document.getElementById('paymentModal');
        const paymentConfirmButton = document.getElementById('paymentConfirmButton');
        const cancelButton = paymentModal?.querySelector('button[onclick="closePaymentModal()"]');
        const overlay = document.getElementById('paymentLoadingOverlay');

        if (paymentConfirmButton) {
            paymentConfirmButton.disabled = isLoading;
            paymentConfirmButton.textContent = isLoading ? 'Processing...' : 'Paid';
            paymentConfirmButton.classList.toggle('opacity-50', isLoading);
            paymentConfirmButton.classList.toggle('cursor-not-allowed', isLoading);
        }
        if (cancelButton) {
            cancelButton.disabled = isLoading;
            cancelButton.classList.toggle('opacity-50', isLoading);
            cancelButton.classList.toggle('cursor-not-allowed', isLoading);
        }
        if (overlay) {
            overlay.classList.toggle('hidden', !isLoading);
        }
    }

    async function processBooking() {
        if (!pendingBookingPayload) {
            alert('Booking data is missing. Please try again.');
            return;
        }

        const bookingUrl = `${BOOKING_API_BASE}/api/bookings`;
        let authHeaders = {
            'Content-Type': 'application/json',
        };

        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session?.access_token) {
                    authHeaders.Authorization = `Bearer ${session.access_token}`;
                }
            } catch (error) {
                console.warn('Unable to read auth session:', error);
            }
        }

        try {
            const response = await fetch(bookingUrl, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(pendingBookingPayload),
            });

            const result = await response.json();
            console.log('Booking response status:', response.status, result);

            if (!response.ok) {
                console.error('Booking request failed:', result);
                setPaymentLoading(false);
                showBookingStatusModal(false, 'Booking Failed', result.error || 'Unable to complete booking. Please try again.');
                return;
            }

            const receiptHtml = buildBookingReceiptHtml({
                fullName: pendingBookingPayload.guest_email ? document.getElementById('fullName').value : '',
                email: pendingBookingPayload.guest_email,
                contact: document.getElementById('contact').value,
                roomName: roomCatalog[pendingBookingPayload.room_type]?.name || pendingBookingPayload.room_type,
                roomType: pendingBookingPayload.room_type,
                checkIn: pendingBookingPayload.start_at,
                checkOut: pendingBookingPayload.end_at,
                nights: calculateNights(pendingBookingPayload.start_at, pendingBookingPayload.end_at),
                adults: adults,
                kids: kids,
                infants: infants,
                extraBeds: pendingBookingPayload.extra_beds,
                amenities: selectedAmenities,
                paymentMethod: pendingBookingPayload.payment_method,
                paymentChoice: pendingBookingPayload.payment_choice || pendingBookingPayload.paymentChoice,
                amountPaid: pendingBookingPayload.amount_paid,
                balanceDue: pendingBookingPayload.balance_due,
                total: pendingBookingPayload.total_price,
            });

            closePaymentModal();
            addUnavailableDatesRange(pendingBookingPayload.start_at, pendingBookingPayload.end_at);
            await refreshAvailabilityForMonth();
            setPaymentLoading(false);
            showBookingStatusModal(true, 'Booking Confirmed', receiptHtml);
        } catch (error) {
            console.error('Booking submission failed:', error);
            setPaymentLoading(false);
            showBookingStatusModal(false, 'Booking Failed', 'Unable to complete booking. Please check your internet connection and try again.');
        }
    }

    async function submitBooking() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const contact = document.getElementById('contact').value;

        if (!fullName || !email || !contact) {
            alert('Please fill in all required fields');
            return;
        }

        if (!selectedCheckIn || !selectedCheckOut) {
            alert('Please select check-in and check-out dates');
            return;
        }
        if (!hasRealRoomData || !roomCatalog[roomType]?.id) {
            alert('Room data is unavailable. Please refresh and try again.');
            return;
        }

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        const nights = calculateNights(selectedCheckIn, selectedCheckOut);
        const rate = roomRates[roomType] || 0;
        const roomTotal = rate * nights;
        const extraBedsTotal = extraBeds * EXTRA_BED_PRICE * nights;
        const amenitiesTotal = getAmenitiesTotalPerNight() * nights;
        const subtotal = roomTotal + extraBedsTotal + amenitiesTotal;
        const eligibleGuests = Math.max(getEligibleGuestCount(), 1);
        const activePwdGuests = pwdDiscount ? Math.min(pwdDiscountCount, eligibleGuests) : 0;
        const activeSeniorGuests = seniorDiscount ? Math.min(seniorDiscountCount, eligibleGuests - activePwdGuests) : 0;
        const effectiveDiscountGuests = activePwdGuests + activeSeniorGuests;
        const perPersonShare = subtotal / eligibleGuests;
        const discountAmount = effectiveDiscountGuests > 0 ? Math.round(perPersonShare * DISCOUNT_RATE * effectiveDiscountGuests) : 0;
        const total = (subtotal - discountAmount) + SERVICE_CHARGE;
        const checkInTime = document.getElementById('checkInTime').value;
        const checkOutTime = document.getElementById('checkOutTime').value;

        const checkInFallback = document.getElementById('checkInDate')?.value || selectedCheckIn;
        const checkOutFallback = document.getElementById('checkOutDate')?.value || selectedCheckOut;

        const bookingPayload = {
            room_id: roomCatalog[roomType]?.id,
            room_type: roomType,
            start_at: checkInFallback,
            end_at: checkOutFallback,
            guests: adults + kids + infants,
            has_pwd: pwdDiscount,
            has_senior: seniorDiscount,
            pwd_count: pwdDiscountCount,
            senior_count: seniorDiscountCount,
            extra_beds: extraBeds,
            total_price: total,
            payment_method: selectedMethod,
            payment_choice: pendingPaymentOption,
            amount_paid: 0,
            balance_due: total,
            guest_email: email,
            amenities: selectedAmenities.map((item) => item.id).filter((id) => id !== undefined && id !== null),
        };

        pendingBookingPayload = bookingPayload;
        pendingBookingTotal = total;
        pendingBookingAmount = Math.ceil(total / 2);
        pendingPaymentOption = 'partial';
        pendingReceiptFile = null;
        openPaymentModal({
            fullName,
            email,
            contact,
            roomName: roomCatalog[roomType]?.name || roomType,
            roomType,
            checkIn: selectedCheckIn,
            checkOut: selectedCheckOut,
            nights,
            adults,
            kids,
            infants,
            pwdDiscount,
            seniorDiscount,
            pwdDiscountCount,
            seniorDiscountCount,
            extraBeds,
            amenities: selectedAmenities,
            paymentMethod: selectedMethod,
            total,
            partialAmount: Math.ceil(total / 2),
        });
        return;
    }

    let bookingStatusSuccess = false;

    function buildBookingReceiptHtml(data) {
        const amenitiesText = data.amenities.length
            ? data.amenities.map((item) => item.name || item).join(', ')
            : 'None';

        return `
            <div class="space-y-4 text-left">
                <p class="text-sm text-gray-700">Thank you <strong>${data.fullName}</strong>! Your booking is confirmed.</p>
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                    <div class="font-semibold text-gray-900 mb-3">Booking Receipt</div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div class="font-semibold">Name:</div><div class="min-w-0 break-words">${data.fullName}</div>
                        <div class="font-semibold">Email:</div><div class="min-w-0 break-words">${data.email}</div>
                        <div class="font-semibold">Contact:</div><div class="min-w-0 break-words">${data.contact}</div>
                        <div class="font-semibold">Room:</div><div class="min-w-0 break-words">${data.roomName} (${data.roomType})</div>
                        <div class="font-semibold">Check-in:</div><div class="min-w-0 break-words">${data.checkIn}</div>
                        <div class="font-semibold">Check-out:</div><div class="min-w-0 break-words">${data.checkOut}</div>
                        <div class="font-semibold">Nights:</div><div class="min-w-0 break-words">${data.nights}</div>
                        <div class="font-semibold">Guests:</div><div class="min-w-0 break-words">${data.adults} Adults, ${data.kids} Kids, ${data.infants} Infants</div>
                        <div class="font-semibold">Extra beds:</div><div class="min-w-0 break-words">${data.extraBeds}</div>
                        <div class="font-semibold">Amenities:</div><div class="min-w-0 break-words">${amenitiesText}</div>
                        <div class="font-semibold">Payment method:</div><div class="min-w-0 break-words">${data.paymentMethod}</div>
                        <div class="font-semibold">Payment choice:</div><div class="min-w-0 break-words">${data.payment_choice || data.paymentChoice || 'Partial'}</div>
                        <div class="font-semibold">Amount paid:</div><div class="min-w-0 break-words">₱${data.amountPaid?.toLocaleString() || '0'}</div>
                        <div class="font-semibold">Balance due:</div><div class="min-w-0 break-words">₱${data.balanceDue?.toLocaleString() || '0'}</div>
                    </div>
                    <div class="mt-4 rounded-lg bg-white p-3 border border-gray-200">
                        <div class="flex justify-between text-sm text-gray-700">
                            <span class="font-semibold">Amount due</span>
                            <span class="font-semibold">₱${data.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p class="font-semibold mb-2">Important</p>
                    <p>Please save or screenshot this receipt and show it to the front desk upon arrival.</p>
                </div>
            </div>
        `;
    }

    function showBookingStatusModal(success, title, message) {
        bookingStatusSuccess = success;
        const bookingModal = document.getElementById('bookingModal');
        const bookingModalTitle = document.getElementById('bookingModalTitle');
        const bookingModalContent = document.getElementById('bookingModalContent');
        const bookingModalContinue = document.getElementById('bookingModalContinue');

        if (!bookingModal || !bookingModalTitle || !bookingModalContent || !bookingModalContinue) {
            alert(`${title}\n\n${message.replace(/<[^>]+>/g, '')}`);
            return;
        }

        bookingModalTitle.textContent = title;
        bookingModalTitle.classList.toggle('text-green-700', success);
        bookingModalTitle.classList.toggle('text-red-700', !success);
        bookingModalContent.innerHTML = message;
        bookingModalContinue.textContent = success ? 'Continue' : 'Try Again';

        const bookingModalDownload = document.getElementById('bookingModalDownload');
        if (bookingModalDownload) {
            bookingModalDownload.classList.toggle('hidden', !success);
        }
        bookingModalContinue.classList.toggle('bg-green-600', success);
        bookingModalContinue.classList.toggle('bg-red-600', !success);

        bookingModal.classList.remove('hidden');
        bookingModal.classList.add('flex');
    }

    function hideBookingStatusModal() {
        const bookingModal = document.getElementById('bookingModal');
        if (!bookingModal) return;
        bookingModal.classList.add('hidden');
        bookingModal.classList.remove('flex');
    }

    document.getElementById('bookingModalClose')?.addEventListener('click', hideBookingStatusModal);

    function downloadBookingReceipt() {
        const payload = pendingBookingPayload;
        if (!payload) {
            alert('Booking data is not available for download yet.');
            return;
        }

        const receiptData = {
            propertyName: 'Your Hotel Name',
            issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            roomName: roomCatalog[payload.room_type]?.name || payload.room_type,
            roomType: payload.room_type,
            checkIn: payload.start_at,
            checkOut: payload.end_at,
            nights: calculateNights(payload.start_at, payload.end_at),
            adults: adults,
            kids: kids,
            infants: infants,
            extraBeds: payload.extra_beds,
            amenities: selectedAmenities.length ? selectedAmenities.map((item) => item.name || item).join(', ') : 'None',
            paymentMethod: payload.payment_method || 'GCash',
            amountPaid: payload.amount_paid ?? 0,
            balanceDue: payload.balance_due ?? 0,
            total: payload.total_price ?? 0,
        };

        const receiptHtml = generateBookingPdfHtml(receiptData);
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.innerHTML = receiptHtml;
        document.body.appendChild(container);

        const options = {
            margin: [10, 10, 10, 10],
            filename: `booking-confirmation-${payload.room_type}-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(options).from(container).save().finally(() => {
            document.body.removeChild(container);
        });
    }

    function generateBookingPdfHtml(data) {
        const currency = (value) => `₱${Number(value).toLocaleString()}`;
        return `
            <div style="font-family: 'Inter', sans-serif; color: #1f2937; background: #ffffff; width: 820px; padding: 32px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                    <div>
                        <div style="font-size: 24px; font-weight: 700; color: #0f5132; letter-spacing: 0.02em;">PROPERTY NAME</div>
                        <div style="margin-top: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em; color: #4b5563;">BOOKING CONFIRMATION VOUCHER</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.12em;">Date of Issue</div>
                        <div style="font-size: 14px; font-weight: 600; color: #111827; margin-top: 4px;">${data.issueDate}</div>
                    </div>
                </div>

                <div style="margin: 28px 0; border-top: 1px solid #e5e7eb;"></div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; line-height: 1.7;">
                    <div>
                        <div style="font-weight: 700; color: #111827; margin-bottom: 10px;">Booking Details</div>
                        <div style="display: grid; gap: 10px;">
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Room</span><strong style="color:#111827;">${data.roomName} (${data.roomType})</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Check-in</span><strong style="color:#111827;">${data.checkIn}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Check-out</span><strong style="color:#111827;">${data.checkOut}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Duration</span><strong style="color:#111827;">${data.nights} Night${data.nights !== 1 ? 's' : ''}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Guests</span><strong style="color:#111827;">${data.adults} Adults, ${data.kids} Kids, ${data.infants} Infants</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Extra Beds</span><strong style="color:#111827;">${data.extraBeds}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Amenities</span><strong style="color:#111827;">${data.amenities}</strong></div>
                        </div>
                    </div>
                    <div>
                        <div style="font-weight: 700; color: #111827; margin-bottom: 10px;">Payment Summary</div>
                        <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; display: grid; gap: 14px;">
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Payment Method</span><strong style="color:#111827;">${data.paymentMethod}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Amount Paid</span><strong style="color:#111827;">${currency(data.amountPaid)}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Balance Due</span><strong style="color:#111827;">${currency(data.balanceDue)}</strong></div>
                            <div style="margin-top: 12px; padding: 16px; border-radius: 14px; background: #ecfdf5; border: 1px solid #d1fae5; display:flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 14px; font-weight: 700; color: #065f46;">Total Amount Due</span>
                                <span style="font-size: 18px; font-weight: 800; color: #065f46;">${currency(data.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin: 32px 0; border-top: 1px solid #e5e7eb;"></div>

                <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 18px; padding: 24px;">
                    <div style="font-size: 14px; font-weight: 700; color: #0f5132; margin-bottom: 14px;">Important Instructions</div>
                    <ol style="padding-left: 18px; color: #374151; font-size: 13px; line-height: 1.8;">
                        <li>Present a printed copy or digital screenshot of this PDF receipt to the front desk officer upon arrival.</li>
                        <li>Standard check-in is at 2:00 PM. Early check-in is subject to room availability.</li>
                        <li>Please bring at least one valid government-issued ID matching the primary guest's name for verification.</li>
                        <li>Since the current amount paid is ${currency(data.amountPaid)}, please be ready to settle the total amount due of ${currency(data.total)} via GCash or Cash at the front desk before room entry.</li>
                    </ol>
                </div>

                <div style="margin-top: 28px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #6b7280; font-size: 12px;">Thank you for your booking. We wish you a wonderful stay.</div>
                    <div style="color: #4b5563; font-size: 12px; font-weight: 700;">Front Desk | Guest Services</div>
                </div>
            </div>
        `;
    }
    document.getElementById('bookingModalContinue')?.addEventListener('click', () => {
        if (bookingStatusSuccess) {
            window.location.href = '/';
            return;
        }

        hideBookingStatusModal();
    });
    document.getElementById('bookingModalDownload')?.addEventListener('click', downloadBookingReceipt);

    document.getElementById('paymentOptionPartial')?.addEventListener('click', () => selectPaymentOption('partial'));
    document.getElementById('paymentOptionFull')?.addEventListener('click', () => selectPaymentOption('full'));
    document.getElementById('paymentUploadArea')?.addEventListener('click', () => {
        const paymentReceiptInput = document.getElementById('paymentReceiptFile');
        paymentReceiptInput?.click();
    });
    document.getElementById('paymentUploadArea')?.addEventListener('dragover', (e) => {
        e.preventDefault();
        document.getElementById('paymentUploadArea')?.classList.add('border-green-500', 'bg-green-50');
    });
    document.getElementById('paymentUploadArea')?.addEventListener('dragleave', () => {
        document.getElementById('paymentUploadArea')?.classList.remove('border-green-500', 'bg-green-50');
    });
    document.getElementById('paymentUploadArea')?.addEventListener('drop', (e) => {
        e.preventDefault();
        const paymentReceiptInput = document.getElementById('paymentReceiptFile');
        document.getElementById('paymentUploadArea')?.classList.remove('border-green-500', 'bg-green-50');
        const file = e.dataTransfer.files[0];
        if (file) handlePaymentReceiptFile(file);
    });
    document.getElementById('paymentReceiptFile')?.addEventListener('change', (e) => {
        if (e.target.files[0]) handlePaymentReceiptFile(e.target.files[0]);
    });
    document.getElementById('paymentAmountInput')?.addEventListener('input', updatePaymentAmountInfo);
    document.getElementById('paymentConfirmButton')?.addEventListener('click', submitPaymentConfirmation);

    window.updateDateSummary = function() {
        const checkInElement = document.getElementById('summaryCheckIn');
        const checkOutElement = document.getElementById('summaryCheckOut');
        const nightsElement = document.getElementById('summaryNights');

        if (checkInElement) {
            checkInElement.innerHTML = selectedCheckIn ? `Check-in: ${formatDate(selectedCheckIn)}` : 'Check-in: Not selected';
        }
        if (checkOutElement) {
            checkOutElement.innerHTML = selectedCheckOut ? `Check-out: ${formatDate(selectedCheckOut)}` : 'Check-out: Not selected';
        }
        if (nightsElement && selectedCheckIn && selectedCheckOut) {
            const nights = calculateNights(selectedCheckIn, selectedCheckOut);
            nightsElement.innerHTML = `${nights} night${nights !== 1 ? 's' : ''}`;
        } else if (nightsElement) {
            nightsElement.innerHTML = '0 nights';
        }
    };

    window.selectedCheckIn = selectedCheckIn;
    window.selectedCheckOut = selectedCheckOut;

    const roomQuery = (new URLSearchParams(window.location.search).get('room') || '').toLowerCase();
    if (roomQuery === 'a' || roomQuery === 'deluxe') {
        const deluxeOption = document.querySelector('input[name="roomType"][value="deluxe"]');
        if (deluxeOption) {
            deluxeOption.checked = true;
            roomType = 'deluxe';
        }
    } else if (roomQuery === 'b' || roomQuery === 'standard') {
        const standardOption = document.querySelector('input[name="roomType"][value="standard"]');
        if (standardOption) {
            standardOption.checked = true;
            roomType = 'standard';
        }
    }

    function initializeBookingPage() {
        document.getElementById('roomTypeSearch')?.addEventListener('input', filterRoomTypes);
        bindAmenitiesHandlers();
        renderCalendar();
        loadRoomsFromBackend();
        syncRoomSummary();
        refreshAvailabilityForMonth();
        updateSummary();
        updateAmenitiesSummary();
        window.updateDateSummary();
        renderCalendar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBookingPage);
    } else {
        initializeBookingPage();
    }
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-YcsIPn+CxQrjXKQ228oczr7VfMifoQf+sG+ECthkyMFS0QXOklxFAQ0OsB56nX8fN9nM5pkPp9RiiPqXoT2elg==" crossorigin="anonymous" referrerpolicy="no-referrer">