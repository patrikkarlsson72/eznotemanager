# Export/Import Functionality Documentation

## Overview
The Export/Import functionality allows users to export their notes to different formats and import notes from text or markdown files. This feature enables users to backup their notes, share them with others, or migrate notes from other applications.

## Export Features

### PDF Export
- Export single or multiple notes to PDF format
- Maintains formatting and structure
- Includes:
  - Note title
  - Category information
  - Tags
  - Note content
  - Timestamps
- Preview functionality before export
- Customized PDF layout with proper spacing and formatting

### Markdown Export
- Export notes to Markdown (.md) format
- Preserves:
  - Note titles (as headers)
  - Categories
  - Tags
  - Content structure
- Clean, readable Markdown syntax
- Compatible with other Markdown editors

### Export Options
- Export individual notes
- Bulk export multiple selected notes
- Export all notes at once
- Selection preview before export
- Dark/Light theme support in preview

## Import Features

### Supported Formats
- Plain Text (.txt) files
- Markdown (.md) files

### Text File Import
- Parses plain text files with the following structure:
  - First line as title
  - Content follows after title
  - Supports category detection (e.g., "Category: Work")
  - Supports tag detection (e.g., "Tags: important, todo")
  - Handles multiple notes separated by double newlines

### Markdown Import
- Parses Markdown files with:
  - H1/H2 headers as note titles
  - Content under each header as note content
  - Metadata parsing for categories and tags
  - Support for basic Markdown formatting

### Import Features
- Drag and drop file support
- File selection via browser dialog
- Preview before import
- Error handling for invalid files
- Progress indication during import
- Clear feedback on import success/failure

## User Interface
- Export button in the top toolbar
- Modal dialogs for both export and import
- Preview functionality for both operations
- Consistent styling with app theme
- Responsive design
- Clear error messages and user feedback

## Technical Implementation
- Uses `pdfmake` for PDF generation
- Uses `file-saver` for file downloads
- Custom parsers for text and markdown content
- State management for selected notes
- Error handling and validation
- Proper cleanup after operations

## Future Considerations
- Support for more import formats (e.g., OneNote HTML export)
- Enhanced formatting preservation
- Batch import of multiple files
- Export with custom templates
- Export to more formats (e.g., HTML, DOCX)

## Usage Examples

### Exporting Notes
1. Click the export button in the toolbar
2. Select export format (PDF or Markdown)
3. Choose notes to export
4. Preview the export
5. Click "Export" to download the file

### Importing Notes
1. Click the import button
2. Drag and drop a file or click to select
3. Review the preview of parsed notes
4. Click "Import" to add notes to your collection

## Error Handling
- Validates file types before import
- Checks file content format
- Provides clear error messages
- Prevents duplicate imports
- Handles large files gracefully 