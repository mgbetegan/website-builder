import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GuestBookService, GuestBook, GuestBookEntry } from '../../services/guestbook.service';

@Component({
  selector: 'app-guestbook',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './guestbook.component.html',
  styleUrls: ['./guestbook.component.scss']
})
export class GuestBookComponent implements OnInit {
  guestBooks: GuestBook[] = [];
  selectedGuestBook: GuestBook | null = null;
  showCreateForm = false;
  showEntryForm = false;

  // Create form
  newGuestBookName = '';

  // Entry form
  entryData: { [key: string]: string } = {};

  // File upload
  selectedFile: File | null = null;

  constructor(private guestBookService: GuestBookService) {}

  ngOnInit(): void {
    this.loadGuestBooks();
  }

  loadGuestBooks(): void {
    this.guestBookService.getAllGuestBooks().subscribe({
      next: (guestBooks) => {
        this.guestBooks = guestBooks;
      },
      error: (error) => {
        console.error('Error loading guest books:', error);
      }
    });
  }

  createGuestBook(): void {
    if (!this.newGuestBookName.trim()) {
      alert('Veuillez entrer un nom pour le livre d\'or');
      return;
    }

    this.guestBookService.createGuestBook({
      name: this.newGuestBookName,
      projectId: 'default' // You can link to current project
    }).subscribe({
      next: (guestBook) => {
        this.guestBooks.push(guestBook);
        this.newGuestBookName = '';
        this.showCreateForm = false;
        alert('Livre d\'or créé avec succès !');
      },
      error: (error) => {
        console.error('Error creating guest book:', error);
        alert('Erreur lors de la création du livre d\'or');
      }
    });
  }

  selectGuestBook(guestBook: GuestBook): void {
    this.selectedGuestBook = guestBook;
    this.initializeEntryForm();
  }

  initializeEntryForm(): void {
    this.entryData = {};
    if (this.selectedGuestBook && this.selectedGuestBook.fields) {
      this.selectedGuestBook.fields.forEach(field => {
        this.entryData[field] = '';
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.docx')) {
      this.selectedFile = file;
    } else {
      alert('Veuillez sélectionner un fichier .docx');
      this.selectedFile = null;
    }
  }

  uploadTemplate(): void {
    if (!this.selectedGuestBook || !this.selectedFile) {
      alert('Veuillez sélectionner un livre d\'or et un fichier');
      return;
    }

    this.guestBookService.uploadTemplate(this.selectedGuestBook.id!, this.selectedFile).subscribe({
      next: (result) => {
        this.selectedGuestBook = result.guestBook;
        this.initializeEntryForm();
        alert(`Template uploadé avec succès !\nChamps détectés: ${result.fields.join(', ')}`);
        this.selectedFile = null;
        this.loadGuestBooks();
      },
      error: (error) => {
        console.error('Error uploading template:', error);
        alert('Erreur lors de l\'upload du template: ' + error.message);
      }
    });
  }

  addEntry(): void {
    if (!this.selectedGuestBook) {
      return;
    }

    // Check if all required fields are filled
    const emptyFields = Object.entries(this.entryData).filter(([key, value]) => !value.trim());
    if (emptyFields.length > 0) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.guestBookService.addEntry(this.selectedGuestBook.id!, this.entryData).subscribe({
      next: (entry) => {
        if (this.selectedGuestBook) {
          this.selectedGuestBook.entries.push(entry);
        }
        this.initializeEntryForm();
        this.showEntryForm = false;
        alert('Entrée ajoutée avec succès !');
      },
      error: (error) => {
        console.error('Error adding entry:', error);
        alert('Erreur lors de l\'ajout de l\'entrée');
      }
    });
  }

  generateDocument(): void {
    if (!this.selectedGuestBook) {
      return;
    }

    if (!this.selectedGuestBook.templatePath) {
      alert('Veuillez d\'abord uploader un template');
      return;
    }

    if (this.selectedGuestBook.entries.length === 0) {
      alert('Le livre d\'or ne contient aucune entrée');
      return;
    }

    const filename = `${this.selectedGuestBook.name.replace(/[^a-z0-9]/gi, '_')}.docx`;
    this.guestBookService.downloadDocument(this.selectedGuestBook.id!, filename);
  }

  deleteGuestBook(guestBook: GuestBook): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${guestBook.name}" ?`)) {
      return;
    }

    this.guestBookService.deleteGuestBook(guestBook.id!).subscribe({
      next: () => {
        this.guestBooks = this.guestBooks.filter(gb => gb.id !== guestBook.id);
        if (this.selectedGuestBook?.id === guestBook.id) {
          this.selectedGuestBook = null;
        }
        alert('Livre d\'or supprimé');
      },
      error: (error) => {
        console.error('Error deleting guest book:', error);
        alert('Erreur lors de la suppression');
      }
    });
  }

  getFieldLabel(field: string): string {
    // Convert snake_case to Title Case
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
