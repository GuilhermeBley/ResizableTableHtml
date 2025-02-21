document.addEventListener('DOMContentLoaded', function () {
  const table = document.getElementById('resizableTable');
  const headers = table.querySelectorAll('th');

  // Load saved column widths from localStorage
  headers.forEach((header) => {
    const columnId = header.id;
    const savedWidth = localStorage.getItem(columnId);

    if (savedWidth) {
      header.style.width = savedWidth; // Apply the saved width
    }
  });

  // Add resizing functionality
  headers.forEach((header) => {
    let startX, startWidth;

    header.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startWidth = header.offsetWidth; // Get the initial width of the column being resized

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
      const newWidth = startWidth + (e.clientX - startX);

      // Set the new width of the column being resized
      header.style.width = `${newWidth}px`;

      // Save the new width to localStorage using the column's ID
      localStorage.setItem(header.id, `${newWidth}px`);

      // Prevent the table from overflowing its container
      table.style.tableLayout = 'auto';
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  });
});