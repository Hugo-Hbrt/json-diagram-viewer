# Feature: Copy Node Path

## User Story
As a user viewing a JSON diagram, I want to right-click on any node and copy its path, so I can reference that location in my code.

## Path Format
Mixed notation (dots for properties, brackets for array indices), no "root" prefix:
- `user.name`
- `items[0].name`
- `users[2].profile.settings`

## Behaviors

### Right-click on card header
- Context menu appears with "Copy Path" option
- Clicking "Copy Path" copies the path to clipboard
- Menu closes after clicking

### Right-click on property key (in property list)
- Context menu appears with "Copy Path" option
- Path includes the property key (e.g., `user.address.city`)

### Path formatting
- Object keys use dot notation: `user.name`
- Array indices use brackets: `items[0]`
- Keys with special chars use brackets: `data["my-key"]`
- Root node copies empty string (or shows disabled state)

### Feedback
- User sees brief confirmation that path was copied

## Examples

| JSON | Right-click on | Copied path |
|------|---------------|-------------|
| `{"user": {"name": "Alice"}}` | "user" card | `user` |
| `{"user": {"name": "Alice"}}` | "name" property | `user.name` |
| `{"items": [{"id": 1}]}` | items[0] card | `items[0]` |
| `{"items": [{"id": 1}]}` | "id" property in items[0] | `items[0].id` |
| `{"my-key": "value"}` | "my-key" property | `["my-key"]` |
