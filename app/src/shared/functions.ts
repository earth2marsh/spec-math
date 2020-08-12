import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { YamlLevel } from './interfaces';
import * as yaml from 'js-yaml';

export const queryElement = (targetFixture: ComponentFixture<any>, targetClass: string) => {
  return targetFixture.debugElement.query(By.css(targetClass));
};

export const readFileAsString = (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.readAsText(file);
    reader.addEventListener('load', () => {
      resolve(reader.result.toString());
    });
  });
};

export const flattenYamlToArray = (levelArray: YamlLevel[], level: number, objectNode: object) => {
  Object.keys(objectNode).forEach((key) => {
    if (typeof (objectNode[key]) === 'object') {
      levelArray.push({
        attribute: `${key}:`,
        level,
      });
      flattenYamlToArray(levelArray, level + 1, objectNode[key]);
    } else {
      levelArray.push({
        attribute: `${key}: ${objectNode[key]}`,
        level,
      });
    }
  });
};

export const flattenYamlFile = async (yamlFile: File): Promise<YamlLevel[]> => {
  const levelArray = [];
  await readFileAsString(yamlFile).then((res) => {
    flattenYamlToArray(levelArray, 0, yaml.load(res));
  });
  return levelArray;
};
