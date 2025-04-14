import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeadAdd } from '../../_models/LeadAdd.model';
import { CheckboxInputComponent } from '../../_shared/form-inputs/checkbox-input/checkbox-input.component';
import { TextInputComponent } from '../../_shared/form-inputs/text-input/text-input.component';
import { DropdownInputComponent } from '../../_shared/form-inputs/dropdown-input/dropdown-input.component';
import { Router } from '@angular/router';
import { LeadService } from '../../_services/lead.service';

@Component({
  selector: 'app-lead-discovery',
  standalone: true,
  imports: [TextInputComponent, ReactiveFormsModule, CommonModule, DropdownInputComponent],
  templateUrl: './lead-discovery.component.html',
  styleUrl: './lead-discovery.component.css'
})
export class LeadDiscoveryComponent implements OnInit {
  leadService = inject(LeadService);
  router = inject(Router);
  leadDiscoveryForm: FormGroup = new FormGroup({});

  hasSpouse = ['Yes', 'No'];
  isPrincipleMember = ['Yes', 'No'];

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormListeners();
  }

  constructor(private fb: FormBuilder) {}

  initializeForm() {
    this.leadDiscoveryForm = this.fb.group({
      'date-sent': ['', Validators.required],
      'date-accident': ['', Validators.required],
      'nature-injury': [''],
      'discovery-lead-id': [''],
      'accident-description': [''],
      'attorney-notes': [''],
      'injured-member-name': ['', Validators.required],
      'member-number': ['', Validators.required],
      'id-number-injured': ['', Validators.required],
      'spouse': ['No'],
      'is-principle-member': ['Yes'],
      'residential-address': [''],
      'home-telephone': [''],
      'work-telephone': [''],
      'cell-phone-number': [''],
      'email-address': [''],
      'spouse-name': [''],
      'spouse-contact-number': [''],
      'principle-name': [''],
      'principle-home-tel': [''],
      'principle-work-tel': [''],
      'principle-cell-tel': ['']
    });
  }

  setupFormListeners() {
    // Listen for changes to is-principle-member
    this.leadDiscoveryForm.get('is-principle-member')?.valueChanges.subscribe(value => {
      this.onIsPrincipleMemberChange();
    });

    // Listen for changes to the injured member fields and update principle member fields if needed
    this.leadDiscoveryForm.get('injured-member-name')?.valueChanges.subscribe(value => {
      this.syncPrincipleFieldIfNeeded('injured-member-name', 'principle-name');
    });

    this.leadDiscoveryForm.get('home-telephone')?.valueChanges.subscribe(value => {
      this.syncPrincipleFieldIfNeeded('home-telephone', 'principle-home-tel');
    });

    this.leadDiscoveryForm.get('work-telephone')?.valueChanges.subscribe(value => {
      this.syncPrincipleFieldIfNeeded('work-telephone', 'principle-work-tel');
    });

    this.leadDiscoveryForm.get('cell-phone-number')?.valueChanges.subscribe(value => {
      this.syncPrincipleFieldIfNeeded('cell-phone-number', 'principle-cell-tel');
    });
  }

  syncPrincipleFieldIfNeeded(sourceField: string, targetField: string) {
    // Only sync if they are the principle member
    if (this.leadDiscoveryForm.get('is-principle-member')?.value === 'Yes') {
      // Create a patch object with just the one field
      const patchObj: any = {};
      patchObj[targetField] = this.leadDiscoveryForm.get(sourceField)?.value;

      // Patch just this one field
      this.leadDiscoveryForm.patchValue(patchObj, { emitEvent: false });
    }
  }

  onIsPrincipleMemberChange() {
    const isPrincipleMember = this.leadDiscoveryForm.get('is-principle-member')?.value;

    if (isPrincipleMember === 'Yes') {
      // If they are the principle member, copy their details to the principle member fields
      this.leadDiscoveryForm.patchValue({
        'principle-name': this.leadDiscoveryForm.get('injured-member-name')?.value,
        'principle-home-tel': this.leadDiscoveryForm.get('home-telephone')?.value,
        'principle-work-tel': this.leadDiscoveryForm.get('work-telephone')?.value,
        'principle-cell-tel': this.leadDiscoveryForm.get('cell-phone-number')?.value
      });
    } else {
      // If they are not the principle member, clear the principle member fields
      this.leadDiscoveryForm.patchValue({
        'principle-name': '',
        'principle-home-tel': '',
        'principle-work-tel': '',
        'principle-cell-tel': ''
      });
    }
  }

  createLead() {
    const DiscoveryLead: LeadAdd = {
      dateSent: this.leadDiscoveryForm.get('date-sent')?.value,
      name: this.leadDiscoveryForm.get('injured-member-name')?.value,
      email: this.leadDiscoveryForm.get('email-address')?.value,
      phone: this.leadDiscoveryForm.get('cell-phone-number')?.value,
      natureOfInjury: this.leadDiscoveryForm.get('nature-injury')?.value,
      accidentDate: this.leadDiscoveryForm.get('date-accident')?.value,
      accidentDescription: this.leadDiscoveryForm.get('accident-description')?.value,
      injuredMemberName: this.leadDiscoveryForm.get('injured-member-name')?.value,
      memberNumber: this.leadDiscoveryForm.get('member-number')?.value,
      idNumberInjured: this.leadDiscoveryForm.get('id-number-injured')?.value,
      spouse: this.leadDiscoveryForm.get('spouse')?.value,
      isPrincipleMember: this.leadDiscoveryForm.get('is-principle-member')?.value,
      residentialAddress: this.leadDiscoveryForm.get('residential-address')?.value,
      homeTelephone: this.leadDiscoveryForm.get('home-telephone')?.value,
      workTelephone: this.leadDiscoveryForm.get('work-telephone')?.value,
      cellPhoneNumber: this.leadDiscoveryForm.get('cell-phone-number')?.value,
      emailAddress: this.leadDiscoveryForm.get('email-address')?.value,
      spouseName: this.leadDiscoveryForm.get('spouse-name')?.value,
      spouseContactNumber: this.leadDiscoveryForm.get('spouse-contact-number')?.value,
      principleName: this.leadDiscoveryForm.get('principle-name')?.value,
      principleHomeTel: this.leadDiscoveryForm.get('principle-home-tel')?.value,
      principleWorkTel: this.leadDiscoveryForm.get('principle-work-tel')?.value,
      principleCellTel: this.leadDiscoveryForm.get('principle-cell-tel')?.value,
      preferredContactMethod: 'Phone',
      preferredLanguage: 'English',
      source: 'Discovery'
    };

    this.leadService.addLead(DiscoveryLead);
    this.leadDiscoveryForm.reset();
    this.leadDiscoveryForm.get('spouse')?.setValue('No');

    // You can call your service to save the lead here

  }

  cancel() {
    this.router.navigate(['/leads']);
  }

  onSubmit() {
    if (this.leadDiscoveryForm.valid) {
      this.createLead();

      this.cancel();
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.leadDiscoveryForm.controls).forEach(key => {
        this.leadDiscoveryForm.get(key)?.markAsTouched();
      });
    }
  }
}
