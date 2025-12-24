# Copy JSON Feature - Behavioral Specification

## Overview

Add a "Copy JSON" option to the existing context menu that copies the JSON representation of the selected node (including all its children) to the clipboard.

---

## User Stories

### US-1: Copy JSON from Object Node
**Given** a JSON diagram with an object node
**When** the user right-clicks on the object's card header
**And** clicks "Copy JSON"
**Then** the complete JSON for that object (including nested children) is copied to the clipboard

### US-2: Copy JSON from Array Node
**Given** a JSON diagram with an array node
**When** the user right-clicks on the array's card header
**And** clicks "Copy JSON"
**Then** the complete JSON array (including all items) is copied to the clipboard

### US-3: Copy JSON from Primitive Node
**Given** a JSON diagram with a primitive value (string, number, boolean, null)
**When** the user right-clicks on the primitive's card
**And** clicks "Copy JSON"
**Then** the primitive value is copied to the clipboard in JSON format

### US-4: Copy JSON from Property Key
**Given** a JSON diagram with an object containing properties
**When** the user right-clicks on a property key (e.g., "name:")
**And** clicks "Copy JSON"
**Then** the JSON value of that specific property is copied to the clipboard

### US-5: Copy JSON from Root Node
**Given** a JSON diagram displaying a document
**When** the user right-clicks on the root card header
**And** clicks "Copy JSON"
**Then** the entire JSON document is copied to the clipboard

---

## Behavioral Requirements

### BR-1: JSON Formatting
- Copied JSON **MUST** be pretty-printed (indented with 2 spaces)
- This ensures readability when pasting into editors

### BR-2: Valid JSON Output
- Copied content **MUST** be valid JSON
- Strings must be quoted: `"hello"` not `hello`
- Numbers copied as-is: `42`, `3.14`
- Booleans as lowercase: `true`, `false`
- Null as: `null`

### BR-3: Menu Ordering
- "Copy JSON" appears **below** "Copy Path" in the context menu
- Maintains consistency with established menu structure

### BR-4: Clipboard Behavior
- Uses the same clipboard API as "Copy Path" (`navigator.clipboard.writeText`)
- Shows toast notification on successful copy

---

## Test Scenarios

### TS-1: Copy primitive string
```json
{ "name": "Alice" }
```
Right-click on "name:" property → Copy JSON → Clipboard contains: `"Alice"`

### TS-2: Copy primitive number
```json
{ "age": 30 }
```
Right-click on "age:" property → Copy JSON → Clipboard contains: `30`

### TS-3: Copy primitive boolean
```json
{ "active": true }
```
Right-click on "active:" property → Copy JSON → Clipboard contains: `true`

### TS-4: Copy null value
```json
{ "data": null }
```
Right-click on "data:" property → Copy JSON → Clipboard contains: `null`

### TS-5: Copy nested object
```json
{ "user": { "name": "Alice", "age": 30 } }
```
Right-click on "user" card header → Copy JSON → Clipboard contains:
```json
{
  "name": "Alice",
  "age": 30
}
```

### TS-6: Copy array
```json
{ "items": [1, 2, 3] }
```
Right-click on "items" card header → Copy JSON → Clipboard contains:
```json
[
  1,
  2,
  3
]
```

### TS-7: Copy array item (object)
```json
{ "users": [{ "name": "Alice" }] }
```
Right-click on array item card → Copy JSON → Clipboard contains:
```json
{
  "name": "Alice"
}
```

### TS-8: Copy root object
```json
{ "a": 1, "b": 2 }
```
Right-click on root card → Copy JSON → Clipboard contains:
```json
{
  "a": 1,
  "b": 2
}
```

### TS-9: Copy deeply nested structure
```json
{ "level1": { "level2": { "level3": { "value": "deep" } } } }
```
Right-click on "level1" card → Copy JSON → Clipboard contains full nested structure with proper indentation

---

## Design Decisions

1. **Empty objects/arrays**: Compact single-line format (`{}` and `[]`)
2. **Large JSON**: No size limit - copy full JSON regardless of size
3. **Feedback**: Show toast notification on successful copy
