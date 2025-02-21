document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('resizableTable');
  const headers = table.querySelectorAll('th');

  // Key for localStorage
  const storageKey = 'columnWidths';

  // Load saved column widths from localStorage
  const savedWidths = JSON.parse(localStorage.getItem(storageKey)) || {};

  headers.forEach((header) => {
    const columnId = header.id;
    if (savedWidths[columnId]) {
      header.style.width = savedWidths[columnId]; // Apply the saved width
    }

    // Add resizing functionality
    let startX, startWidth;

    header.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startWidth = header.offsetWidth; // Get the initial width of the column being resized

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      const newWidth = startWidth + (e.clientX - startX);

      // Ensure the new width is not less than a minimum value (e.g., 50px)
      if (newWidth < 50) newWidth = 50;

      // Calculate the difference in width
      const widthDifference = newWidth - startWidth;

      // Update the column width
      header.style.width = `${newWidth}px`;

      // Update the table width
      const tableWidth = table.offsetWidth;
      table.style.width = `${tableWidth + widthDifference}px`;

      // Update the saved widths object
      savedWidths[columnId] = `${newWidth}px`;

      // Save the updated widths to localStorage as a JSON string
      localStorage.setItem(storageKey, JSON.stringify(savedWidths));
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });
});