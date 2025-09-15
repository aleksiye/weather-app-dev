import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherCardDetailed } from './weather-card-detailed';

describe('WeatherCardDetailed', () => {
  let component: WeatherCardDetailed;
  let fixture: ComponentFixture<WeatherCardDetailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherCardDetailed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherCardDetailed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
