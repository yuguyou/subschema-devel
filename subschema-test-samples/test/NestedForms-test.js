import React from 'react';
import {into, expect, byComponents, byId}  from 'subschema-test-support';
import {NestedForms} from 'subschema-test-samples';
import {newSubschemaContext, ValueManager} from 'subschema';

describe('public/NestedForms', function () {
    let Form, loader, Subschema, FieldSetTemplate;
    beforeEach(function () {
        Subschema = newSubschemaContext();
        Form = Subschema.Form;
        loader = Subschema.loader;
        FieldSetTemplate = loader.loadTemplate('FieldSetTemplate');
    });

    it('should render simple nested with seperate templates', function () {
        const form = into(<Form
            schema={{
                schema: {
                    first: 'Text',
                    second: {
                        type: 'Object',
                        subSchema: {
                            test: 'Text'
                        }
                    }
                },
                fieldsets: [{legend: 'First Legend', fields: 'first'},

                    {legend: 'Second Legend', fields: 'second.test'}]
            }}
        />, true);
        expect(form).toExist();
        expect(byComponents(form, FieldSetTemplate).length, 'should find three FieldSetTemplate').toBe(3)
    });
    it('should render simple nested', function () {
        const form = into(<Form
            schema={{
                schema: {
                    first: 'Text',
                    second: {
                        type: 'Object',
                        subSchema: {
                            test: 'Text'
                        }
                    }
                },
                fieldsets: [{fields: 'second.test, first', legend: 'All'}]
            }}
        />, true);
        expect(form).toExist();
        expect(byComponents(form, FieldSetTemplate).length).toBe(2)
    });
    it('should render nested forms', () => {
        const valueManager = Subschema.valueManager = ValueManager(NestedForms.data);

        const form = into(<Form schema={NestedForms.schema} valueManager={valueManager}/>, true);

        const street = byId(form, 'address.street');

        expect(street).toExist('should render street');

        expect(street.value).toBe('1 First St');

        valueManager.update('address.street', 'Something');
        expect(byId(form, 'address.street').value).toBe('Something');

    });
});