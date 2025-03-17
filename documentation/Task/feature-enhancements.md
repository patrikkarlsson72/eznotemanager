# Task: Feature Enhancements

## Objective
Implement new features to enhance user experience and functionality.

## Features
- **User Authentication**: Add Google and Facebook authentication.
- **Note Sharing**: Enable users to share notes with others.
- **Search Functionality**: Implement a search feature for notes.

# Feature Enhancements

## Export Functionality Improvements (Latest)

### PDF Export Enhancements
- Fixed styling issues in PDF exports:
  - Set text color to black (`#000000`) for better visibility
  - Adjusted metadata color to dark gray (`#333333`)
  - Added line height of `1.6` for improved readability
  - Made titles bold and clearly visible
  - Improved image handling:
    - Images display as blocks with proper margins
    - Set max-width to 90% for better layout
    - Prevented page breaks inside images
  - Enhanced list styling:
    - Fixed bullet points and numbering alignment
    - Added proper padding and spacing
    - Improved vertical alignment of list items
  - Added white background and proper margins

### Markdown Export Implementation
- Added Markdown export option alongside PDF export
- Improved Markdown conversion:
  - Properly formats headings with `#` syntax
  - Converts lists to proper Markdown format:
    - Unordered lists use `- ` prefix
    - Ordered lists use `1. ` prefix
  - Preserves links in Markdown format: `[text](url)`
  - Handles images with proper Markdown syntax: `![alt](src)`
  - Maintains document structure with proper spacing
  - Includes metadata (category and tags) in bold format

### UI Improvements
- Added export dropdown menu in the TipTap editor toolbar
- Export button now shows two options:
  - Export as PDF
  - Export as Markdown
- Implemented proper dropdown positioning and styling
- Added click-outside handling to close the dropdown
- Maintained dark/light theme support for the export menu

### Technical Implementation
- Used React Portal for better dropdown menu rendering
- Added refs to track button and menu positions
- Implemented proper cleanup of event listeners
- Maintained consistent styling with the rest of the application
- Preserved existing note metadata in both export formats 