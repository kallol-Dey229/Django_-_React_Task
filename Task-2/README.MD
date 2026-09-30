## Task 2: Insert Sample Patient Data

migrations are applied, then run:

```bash
python insert_patients.py
```

The script uses `update_or_create`, so running it multiple times will not create duplicate rows. New rows added to the list will be inserted and existing ones ignored.