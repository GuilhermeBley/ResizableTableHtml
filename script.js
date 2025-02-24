document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('resizableTable');
  const headers = table.querySelectorAll('th');

  // Key for localStorage
  const storageKey = 'columnWidths';

  // Load saved column widths from localStorage
  const savedWidths = JSON.parse(localStorage.getItem(storageKey)) || {};

  // Initialize column widths and set table width
  let totalWidth = 0;
  headers.forEach((header, index) => {
    const columnId = header.id || `col-${index}`;
    if (savedWidths[columnId]) {
      header.style.width = savedWidths[columnId]; // Apply the saved width
      totalWidth += parseInt(savedWidths[columnId], 10); // Add to total width
    } else {
      const initialWidth = header.offsetWidth; // Use current width if no saved width
      header.style.width = `${initialWidth}px`;
      totalWidth += initialWidth;
    }
  });

  // Set the table width to the sum of all column widths
  table.style.width = `${totalWidth}px`;

  headers.forEach((header, index) => {
    const columnId = header.id || `col-${index}`;

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

      // Update the saved widths object
      savedWidths[columnId] = `${newWidth}px`;

      // Save the updated widths to localStorage as a JSON string
      localStorage.setItem(storageKey, JSON.stringify(savedWidths));

      // Update the table width to match the sum of all column widths
      updateTableWidth();
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });

  function adjustOtherColumns(resizedColumnIndex, widthDifference) {
    const totalColumns = headers.length;
    const otherColumnsWidth = Array.from(headers).reduce((sum, header, index) => {
      if (index !== resizedColumnIndex) {
        return sum + header.offsetWidth;
      }
      return sum;
    }, 0);

    // Calculate the ratio to adjust the other columns
    const ratio = (otherColumnsWidth - widthDifference) / otherColumnsWidth;

    // Adjust the widths of the other columns
    headers.forEach((header, index) => {
      if (index !== resizedColumnIndex) {
        const newWidth = header.offsetWidth * ratio;
        header.style.width = `${newWidth}px`;
      }
    });
  }

  function updateTableWidth() {
    const newTotalWidth = Array.from(headers).reduce((sum, header) => sum + header.offsetWidth, 0);
    table.style.width = `${newTotalWidth}px`;
  }
});