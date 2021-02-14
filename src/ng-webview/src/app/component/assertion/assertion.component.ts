import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BabylonRow } from 'src/app/model/babylon.model';
import { SelectedExampleWrapper } from 'src/app/model/helper.model';
import { ExampleResult } from '../../../../../babylonianAnalysisTypes';

@Component({
  selector: 'assertion',
  templateUrl: './assertion.component.html',
  styleUrls: ['./assertion.component.css']
})
export class AssertionComponent implements  OnChanges, OnInit {

  @Input() babylon: BabylonRow;

  @Input() selectedExamples: Array<SelectedExampleWrapper>;

  private initialized = false;

  private _observedValues: Map<string, string>;

  public selectedValues: Map<string, string>;

  constructor() { }

  ngOnInit(): void {
    this._observedValues = this.extractObservedValues();
    this.selectExamples();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      if (changes.selectedExamples) {
        this.selectedExamples = changes.selectedExamples.currentValue;
        this.selectExamples();
      }
    }
  }

  public getColor(key: string) {
    const example = this.selectedExamples.find(e => e.name === key);
    if(example) {
      return example.color;
    }
    return "black";
  }

  private selectExamples() {
    this.selectedValues = new Map<string, string>();
    this._observedValues.forEach((value: string, key: string) => {
      if (SelectedExampleWrapper.inSelectedExample(this.selectedExamples, key)) {
        this.selectedValues.set(key, value);
      }
    });
  }

  private extractObservedValues(): Map<string, string> {
    const map = new Map<string, string>();
    if (this.babylon.examples && this.babylon.examples.length > 0) {
      let exampleResult: ExampleResult;
      for (exampleResult of this.babylon.examples) {
        map.set(exampleResult.exampleName, exampleResult.observedValues[0].displayString);
      }
    }
    return map;
  }


}