import { Input, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSlider, MatSliderChange } from '@angular/material/slider';
import { BabylonRow } from 'src/app/model/babylon.model';
import { BabylonService } from 'src/app/service/babylon.service';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ExampleResult } from '../../../../../babylonianAnalysisTypes';
import { OnChanges } from '@angular/core';
import { Probe, SelectedExampleWrapper } from 'src/app/model/helper.model';

@Component({
  selector: 'probe',
  templateUrl: './probe.component.html',
  styleUrls: ['./probe.component.css']
})
export class ProbeComponent implements OnChanges, OnInit {

  @Input() babylon: BabylonRow;

  @Input() selectedExamples: Array<SelectedExampleWrapper>;

  private _observedValues: Map<string, Array<string>>;
  private _initialized = false;

  public probeValues: Map<string, Probe>;
  public showSlider: boolean;

  public lineText: string;
  public leadingWhitespaces: string;

  public leftMargin: string;

  private sliderActionCounter: number;

  constructor(private babylonService: BabylonService, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.sliderActionCounter = 0;
    this.showSlider = false;
    this.formatText();
    this.leftMargin = this.calculateLeftMargin().concat('px');
    this._observedValues = this.extractObservedValues();
    this.probeValues = new Map<string, Probe>();
    this.selectExamples();
    this._initialized = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this._initialized) {
      if (changes.selectedExamples) {
        this.selectedExamples = changes.selectedExamples.currentValue;
        this.selectExamples();
      }
    }
  }

  // Display With
  public updateSliderLabel(value: any) {
    return value;
  }

  // on Change
  public onSliderChange(event: MatSliderChange, key: string) {
    const probe = this.probeValues.get(key);
    const sliderValue: number = event.value;
    probe.defaultValue = sliderValue;
    probe.textInput = probe.values[sliderValue - 1];
  }

  // Mouseout
  public hideSlider() {
    let currentActionCounter = this.sliderActionCounter;
    setTimeout(() => {
      if (currentActionCounter === this.sliderActionCounter) {
        //this.showSlider = false;
      }
    }, 1000);
  }

  // Mouseover
  public displaySlider() {
    this.sliderActionCounter++;
    this.showSlider = true;
  }

  private extractObservedValues(): Map<string, Array<string>> {
    const map = new Map<string, Array<string>>();
    if (this.babylon.examples && this.babylon.examples.length > 0) {
      let exampleResult: ExampleResult;
      for (exampleResult of this.babylon.examples) {
        map.set(exampleResult.exampleName, this.getObservedValues(exampleResult));
      }
    }
    return map;
  }

  private getObservedValues(exampleResult: ExampleResult): Array<string> {
    const result = new Array<string>();
    if (exampleResult.observedValues) {
      for (const observedValue of exampleResult.observedValues) {
        if (observedValue.displayString) {
          result.push(observedValue.displayString);
        }
      }
    }
    return result;
  }

  private selectExamples() {
    const _probeValues = new Map<string, Probe>();
    this._observedValues.forEach((value: Array<string>, key: string) => {
      if (SelectedExampleWrapper.inSelectedExample(this.selectedExamples, key)) {
        const preserveValues = this.probeValues.get(key);
        const _defaultValue = preserveValues ? preserveValues.defaultValue : 1;
        _probeValues.set(key, new Probe({
          babylonText: this.babylon.text,
          exampleName: key,
          values: value,
          color: this.selectedExamples.find(e => e.name === key).color,
          defaultValue: _defaultValue,
          textInput: value[_defaultValue - 1]
        }));
      }
    });
    this.probeValues = _probeValues;
  }

  private formatText() {
    let spaces = '';
    let txt = '';
    Array.from(this.babylon.text).forEach(c => {
      if (c === ' ') {
        spaces = spaces.concat(' ');
      }
    });
    txt = this.babylon.text.trim();
    this.lineText = txt;
    this.babylon.text = txt;
    this.leadingWhitespaces = spaces;
  }

  private calculateLeftMargin(): string {
    const marginHelper = this.renderer.createElement('div');
    this.renderer.setProperty(marginHelper, 'id', 'marginHelper');
    this.renderer.addClass(marginHelper, 'marginHelperClass');
    const text = this.renderer.createText('0');
    this.renderer.appendChild(marginHelper, text);
    this.renderer.appendChild(document.body, marginHelper);

    const helper = document.getElementById('marginHelper');
    const width = helper.offsetWidth;

    this.renderer.removeChild(document.body, marginHelper);
    return (this.leadingWhitespaces.length * width).toString();
  }
}
