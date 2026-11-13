**Step-by-step run:**

| Action                   | path      | Saved     |
| ------------------------ | --------- | --------- |
| start                    | []        | []        |
| choose 1                 | [1]       | [1]       |
| choose 2                 | [1, 2]    | [1, 2]    |
| choose 3                 | [1, 2, 3] | [1, 2, 3] |
| undo 3, undo 2, choose 3 | [1, 3]    | [1, 3]    |
| undo 3, undo 1, choose 2 | [2]       | [2]       |
| choose 3                 | [2, 3]    | [2, 3]    |
| undo 3, undo 2, choose 3 | [3]       | [3]       |
