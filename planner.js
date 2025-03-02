document.addEventListener('DOMContentLoaded', function() {
    // Initialize draggable items
    const draggable = new Draggable.Sortable(document.querySelectorAll('.timeline-container'), {
        draggable: '.scheduled-activity',
        handle: '.drag-handle'
    });

    // Handle drag and drop from activities to timeline
    const activities = document.querySelectorAll('.activity-item');
    const timelineContainers = document.querySelectorAll('.timeline-container');

    activities.forEach(activity => {
        activity.addEventListener('dragstart', handleDragStart);
        activity.addEventListener('dragend', handleDragEnd);
    });

    timelineContainers.forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('drop', handleDrop);
    });

    function handleDragStart(e) {
        e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        const container = e.currentTarget;
        container.classList.remove('drag-over');
        
        const draggedActivity = document.querySelector('.dragging');
        if (draggedActivity) {
            const time = prompt('Enter time for this activity (HH:MM):', '09:00');
            if (time) {
                const scheduledActivity = createScheduledActivity(
                    draggedActivity.querySelector('i').className,
                    draggedActivity.querySelector('span').textContent,
                    time
                );
                container.appendChild(scheduledActivity);
            }
        }
    }

    function createScheduledActivity(iconClass, text, time) {
        const div = document.createElement('div');
        div.className = 'scheduled-activity';
        div.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-grip-vertical drag-handle"></i>
                <span class="time">${time}</span>
                <i class="${iconClass}"></i>
                <span class="ms-2">${text}</span>
            </div>
            <i class="fas fa-times remove-btn"></i>
        `;

        div.querySelector('.remove-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            div.remove();
        });

        return div;
    }
});