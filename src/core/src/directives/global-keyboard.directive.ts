import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MatKeyboardService } from '../services/keyboard.service';

@Directive({
  selector: '[globalKeyboard]'
})
export class GlobalKeyboardDirective implements OnDestroy {

    private _isNumber: boolean;
    private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

    @Input() globalKeyboard: string;

    @Input() darkTheme: boolean;

    @Input() duration: number;

    @Input() isDebug: boolean;

    @Input() disabled: boolean;

    @Output() enterClick: EventEmitter<void> = new EventEmitter<void>();

    @Output() capsClick: EventEmitter<void> = new EventEmitter<void>();

    @Output() altClick: EventEmitter<void> = new EventEmitter<void>();

    @Output() shiftClick: EventEmitter<void> = new EventEmitter<void>();

    @Output() genericClick: EventEmitter<void> = new EventEmitter<void>();

    constructor(private _keyboardService: MatKeyboardService) {}

    ngOnDestroy() {
        this._hideKeyboard();
    }

    @HostListener('window:focusin', ['$event'])
    private _showKeyboard() {
        if (!this.disabled && (event.srcElement instanceof HTMLInputElement || event.srcElement instanceof HTMLTextAreaElement)) {
            const input = event.srcElement;
            const elementRef = new ElementRef(input);
            const readonly = input.getAttribute('readonly') !== null && input.getAttribute('readonly') !== 'true';
            if (!readonly) {
                this._keyboardRef = this._keyboardService.open(this.globalKeyboard, {
                    darkTheme: this.darkTheme,
                    duration: this.duration,
                    isDebug: this.isDebug
                });
                this._isNumber = input.type === 'number';
                if (this._isNumber) {
                    elementRef.nativeElement.type = 'text';
                }
              
                // reference the input element
                this._keyboardRef.instance.setInputInstance(elementRef);

                // connect outputs
                this._keyboardRef.instance.enterClick.subscribe(() => this.enterClick.next());
                this._keyboardRef.instance.capsClick.subscribe(() => this.capsClick.next());
                this._keyboardRef.instance.altClick.subscribe(() => this.altClick.next());
                this._keyboardRef.instance.shiftClick.subscribe(() => this.shiftClick.next());
                this._keyboardRef.instance.genericClick.subscribe(() => this.genericClick.next());
            }
        }
    }

    @HostListener('window:focusout', ['$event'])
    private _hideKeyboard() {
        if (this._keyboardRef && (event.srcElement instanceof HTMLInputElement || event.srcElement instanceof HTMLTextAreaElement)) {
            if (this._isNumber) {
                const elementRef = new ElementRef(event.srcElement);
                elementRef.nativeElement.type = 'number';
            }
            this._keyboardRef.dismiss();
        }
    }

}
