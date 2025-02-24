document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('resizableTable');
  const headers = table.querySelectorAll('th');

  // Key for localStorage
  const storageKey = 'columnWidths';

  // Load saved column widths from localStorage
  const savedWidths = JSON.parse(localStorage.getItem(storageKey)) || {};

  // Initialize column widths and calculate initial table width
  let tableWidth = 0;
  headers.forEach((header, index) => {
    const columnId = header.id || `col-${index}`;
    if (savedWidths[columnId]) {
      header.style.width = savedWidths[columnId]; // Apply the saved width
      tableWidth += parseInt(savedWidths[columnId], 10); // Add to table width
    } else {
      const initialWidth = header.offsetWidth; // Use current width if no saved width
      header.style.width = `${initialWidth}px`;
      tableWidth += initialWidth;
    }
  });

  // Set the initial table width
  table.style.width = `${tableWidth}px`;

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
      let dif = startWidth - newWidth

      // Ensure the new width is not less than a minimum value (e.g., 50px)
      if (newWidth < 50) newWidth = 50;

      // Allow increasing size only when moving to the right
      if (e.clientX > startX) {
        header.style.width = `${newWidth}px`;
        updateTableWidth(dif * -1);
      }
      // Allow decreasing size only when moving to the left
      else if (e.clientX < startX) {
        header.style.width = `${newWidth}px`;
        updateTableWidth(dif);
      }

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

  // Function to update the table width based on the sum of column widths
  function updateTableWidth(sizeChanged) {
    let newTableWidth = 0;
    headers.forEach((header) => {
      newTableWidth += header.offsetWidth; // Sum up all column widths
    });
    console.log('table dif is ', sizeChanged)
    newTableWidth += sizeChanged
    table.style.width = `${newTableWidth}px`; // Set the table width
  }
});