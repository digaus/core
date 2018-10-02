import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MatKeyboardService } from '../services/keyboard.service';

@Directive({
  selector: '[globalKeyboard]'
})
export class GlobalKeyboardDirective implements OnDestroy {

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;

  @Input() globalKeyboard: string;

  @Input() darkTheme: boolean;

  @Input() duration: number;

  @Input() isDebug: boolean;

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
        if (event.srcElement instanceof HTMLInputElement || event.srcElement instanceof HTMLTextAreaElement) {
            const input = event.srcElement;
            const elementRef = new ElementRef(input);
            const readonly = input.getAttribute('readonly') !== null && input.getAttribute('readonly') !== 'true';
            if (!readonly) {
                this._keyboardRef = this._keyboardService.open(this.globalKeyboard, {
                    darkTheme: this.darkTheme,
                    duration: this.duration,
                    isDebug: this.isDebug
                });
                // reference the input element
                this._keyboardRef.instance.setInputInstance(elementRef);

                // connect outputs
                this._keyboardRef.instance.enterClick.subscribe(() => {this.enterClick.next(); this._dispatchEnter(input)});
                this._keyboardRef.instance.capsClick.subscribe(() => this.capsClick.next());
                this._keyboardRef.instance.altClick.subscribe(() => this.altClick.next());
                this._keyboardRef.instance.shiftClick.subscribe(() => this.shiftClick.next());
                this._keyboardRef.instance.genericClick.subscribe(() => {this.genericClick.next(); this._dispatchInput(input)});
            }
        }
    }

    @HostListener('window:focusout', ['$event'])
    private _hideKeyboard() {
        if (event.srcElement instanceof HTMLInputElement || event.srcElement instanceof HTMLTextAreaElement && this._keyboardRef) {
            this._keyboardRef.dismiss();
        }
    }

    private _dispatchEnter(inputElement: HTMLInputElement | HTMLTextAreaElement): void {
        let ev = document.createEvent('Events');
        ev.initEvent('keydown', true, true);
        ev['keyCode'] = 13;
        ev['which'] = 13;
        ev['charCode'] = 13;
        ev['key'] = 'Enter';
        ev['code'] = 'Enter';
        inputElement.dispatchEvent(ev);
        ev = document.createEvent('Events');
        ev.initEvent('keypress', true, true);
        ev['keyCode'] = 13;
        ev['which'] = 13;
        ev['charCode'] = 13;
        ev['key'] = 'Enter';
        ev['code'] = 'Enter';
        inputElement.dispatchEvent(ev);
        ev = document.createEvent('Events');
        ev.initEvent('keyup', true, true);
        ev['keyCode'] = 13;
        ev['which'] = 13;
        ev['charCode'] = 13;
        ev['key'] = 'Enter';
        ev['code'] = 'Enter';
        inputElement.dispatchEvent(ev);
    }

    private _dispatchInput(inputElement: HTMLInputElement | HTMLTextAreaElement): void {
        setTimeout(() => {
          inputElement.dispatchEvent(new Event('input',{ bubbles: true }))
        });
    }

}
