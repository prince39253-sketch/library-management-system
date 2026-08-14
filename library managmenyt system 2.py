
```python
# ==========================================
# Library Management System
# ==========================================

library = {
    "Python Basics": 5,
    "Data Science": 3,
    "Machine Learning": 2
}


def view_books():
    print("\n--------- AVAILABLE BOOKS ---------")

    if not library:
        print("No books available in the library.")
        return

    for book, quantity in library.items():
        print(f"{book:<25} : {quantity} copies")


def issue_book():
    book_name = input("\nEnter book name to issue: ").strip()

    if book_name not in library:
        print("Book not found in the library.")
        return

    if library[book_name] <= 0:
        print("Sorry, this book is currently unavailable.")
        return

    library[book_name] -= 1
    print(f"'{book_name}' has been issued successfully.")


def return_book():
    book_name = input("\nEnter book name to return: ").strip()

    if book_name in library:
        library[book_name] += 1
    else:
        library[book_name] = 1

    print(f"'{book_name}' has been returned successfully.")


def add_book():
    book_name = input("\nEnter book name: ").strip()

    try:
        quantity = int(input("Enter quantity: "))

        if quantity <= 0:
            print("Quantity must be greater than zero.")
            return

        if book_name in library:
            library[book_name] += quantity
            print("Book quantity updated successfully.")
        else:
            library[book_name] = quantity
            print("New book added successfully.")

    except ValueError:
        print("Please enter a valid number.")


def remove_book():
    book_name = input("\nEnter book name to remove: ").strip()

    if book_name not in library:
        print("Book not found.")
        return

    del library[book_name]
    print(f"'{book_name}' has been removed from the library.")


def search_book():
    keyword = input("\nEnter book name or keyword: ").strip().lower()

    found = False

    print("\n--------- SEARCH RESULTS ---------")

    for book, quantity in library.items():
        if keyword in book.lower():
            print(f"{book:<25} : {quantity} copies")
            found = True

    if not found:
        print("No matching books found.")


def show_statistics():
    total_titles = len(library)
    total_copies = sum(library.values())
    available_books = sum(1 for quantity in library.values() if quantity > 0)

    print("\n--------- LIBRARY STATISTICS ---------")
    print(f"Total book titles : {total_titles}")
    print(f"Total copies      : {total_copies}")
    print(f"Available titles  : {available_books}")


def main():
    while True:
        print("\n======================================")
        print("       LIBRARY MANAGEMENT SYSTEM")
        print("======================================")
        print("1. View Books")
        print("2. Issue Book")
        print("3. Return Book")
        print("4. Add Book")
        print("5. Remove Book")
        print("6. Search Book")
        print("7. Library Statistics")
        print("8. Exit")
        print("======================================")

        choice = input("Enter your choice (1-8): ").strip()

        if choice == "1":
            view_books()

        elif choice == "2":
            issue_book()

        elif choice == "3":
            return_book()

        elif choice == "4":
            add_book()

        elif choice == "5":
            remove_book()

        elif choice == "6":
            search_book()

        elif choice == "7":
            show_statistics()

        elif choice == "8":
            print("\nThank you for using the Library Management System!")
            print("Goodbye!")
            break

        else:
            print("\nInvalid choice. Please select a number from 1 to 8.")


if __name__ == "__main__":
    main()
```
