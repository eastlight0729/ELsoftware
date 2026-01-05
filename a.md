Create Grid-based year-calendar UI in @src/features/year-calendar/components . Here is detail description.

1. The row is month: 1 to 12, the column is day: 1 to 31. but the number of column is 37 to align day of the week.
2. Weekdays is white(or black) and Weekends is red.
3. The month name is on the right of the row, day name is on the grid cell, but don't write the day of the week on the top of the column.
4. the base design is light glassmorphism.
5. there is today indicator on the grid cell. the color is sky.
6. Fix the grid cell size even if user resize the window.
7. User resize the window(or user use mobile view, not desktop view), the row and column should be changed. It means that the column is month and the row is days.
8. Make a scroll bar in the grid, not screen.
9. Added Year Display: A large, watermark-style year number (e.g., "2026") to appear in the background of the calendar card.
10. Add the dragging feature: User drag year-calendar to the left/right → the year calendar switch into previous/next year calendar.