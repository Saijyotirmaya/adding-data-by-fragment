sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast,JSONModel,Fragment) {
    "use strict";

    return Controller.extend("com.kt.sap.view.project2.controller.main", {
        onInit: function () {
            var oModel = new JSONModel({
                InputData: [] ,
                formData: {
                    id: "",
                    name: "",
                    age: "",
                    city: "",
                    action: "Add",
                    isEditable: true
                },
                
                rowCount: 0 
            });
            this.getView().setModel(oModel, "myModel");
        },
        onSavepress: function () {
            var oModel = this.getView().getModel("myModel");
            var oFormData = {
                id: this.byId("idInput1").getValue(),
                name: this.byId("nameInput1").getValue(),
                age: this.byId("ageInput1").getValue(),
                city: this.byId("cityInput1").getValue(),
            };
            var aData = oModel.getProperty("/InputData");
            
            // Validate inputs
            if (!oFormData.id || !oFormData.name || !oFormData.age || !oFormData.city) {
                MessageToast.show("Please fill all fields!");
                return;
            }
        
            if (oModel.getProperty("/formData/action") === "Add") {
                // Check for duplicate ID
                var bDuplicate = aData.some(item => item.id === oFormData.id);
                if (bDuplicate) {
                MessageToast.show("ID already exists. Please use a unique ID.");
                    return;
                }
        
                // Add new entry
                aData.push(oFormData);
                MessageToast.show("Entry added successfully!");
            } else if (oModel.getProperty("/formData/action") === "Edit") {
                // Find and update the selected row
                var iIndex = aData.findIndex(item => item.id === oFormData.id);
                if (iIndex !== -1) {
                    aData[iIndex] = oFormData;
                    sap.m.MessageToast.show("Entry updated successfully!");
                }
            }
        
            // Update the model and close the dialog
            oModel.setProperty("/InputData", aData);
             // Update the row count
              
             oModel.setProperty("/rowCount", aData.length);
           
           
        },
      
        

        onAddbtnpress: function () {
            var oModel = this.getView().getModel("myModel");
            oModel.setProperty("/formData", {
                id: "",
                name: "",
                age: "",
                city: "",
                action: "Add"
            });
        
            this._openFragment();
        },
        onDeletePress:function(){
            var oTable = this.byId("idMyTable1");
            var oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a row to delete!");
                return;
            }
        
            // Get the selected row's binding context
            var oSelectedContext = oSelectedItem.getBindingContext("myModel");
            var sPath = oSelectedContext.getPath();
            var iIndex = parseInt(sPath.split("/").pop(), 10);
        
            // Remove the selected row
            var oModel = this.getView().getModel("myModel");
            var aData = oModel.getProperty("/InputData");
            aData.splice(iIndex, 1);
        
            // Update the model
            oModel.setProperty("/InputData", aData);
        
            // Update the row count
            oModel.setProperty("/rowCount", aData.length);
        
            // Clear selection and notify the user
            oTable.removeSelections();
            sap.m.MessageToast.show("Row deleted successfully!");
        },
        onEditpress:function(){
            var oTable = this.byId("idMyTable1");
            var oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                sap.m.MessageToast.show("Please select a row to edit!");
                return;
            }
        
            // Get selected row data
            var oSelectedContext = oSelectedItem.getBindingContext("myModel");
            var oRowData = oSelectedContext.getObject();
        
            // Set data to the form
            var oModel = this.getView().getModel("myModel");
            oModel.setProperty("/formData", {
                id: oRowData.id,
                name: oRowData.name,
                age: oRowData.age,
                city: oRowData.city,
                action: "Edit"
            });
        
            this._openFragment();
        },
        onSave: function () {
            var oModel = this.getView().getModel("myModel");
            var oFormData = {
                id: this.byId("idInput").getValue(),
                name: this.byId("nameInput").getValue(),
                age: this.byId("ageInput").getValue(),
                city: this.byId("cityInput").getValue(),
            };
            var aData = oModel.getProperty("/InputData");
        
            // Validate inputs
            if (!oFormData.id || !oFormData.name || !oFormData.age || !oFormData.city) {
                sap.m.MessageToast.show("Please fill all fields!");
                return;
            }
        
            if (oModel.getProperty("/formData/action") === "Add") {
                // Check for duplicate ID
                var bDuplicate = aData.some(item => item.id === oFormData.id);
                if (bDuplicate) {
                    sap.m.MessageToast.show("ID already exists. Please use a unique ID.");
                    return;
                }
        
                // Add new entry
                aData.push(oFormData);
                sap.m.MessageToast.show("Entry added successfully!");
            } else if (oModel.getProperty("/formData/action") === "Edit") {
                // Find and update the selected row
                var iIndex = aData.findIndex(item => item.id === oFormData.id);
                if (iIndex !== -1) {
                    aData[iIndex] = oFormData;
                    sap.m.MessageToast.show("Entry updated successfully!");
                }
            }
        
            // Update the model and close the dialog
            oModel.setProperty("/InputData", aData);
             // Update the row count
             oModel.setProperty("/rowCount", aData.length);

            oModel.setProperty("/formData", {
                id: "",
                name: "",
                age: "",
                city: "",
                
            });
            this._oDialog.close();
        },

        onCancel: function () {
            this._oDialog.close();
        },
        _openFragment: function () {
            if (!this._oDialog) {
                Fragment.load({
                    id: this.getView().getId(),
                    name: "com.kt.sap.project2.fragment.Newdialog",
                    controller: this
                }).then(function (oDialog) {
                    this._oDialog = oDialog;
                    this.getView().addDependent(this._oDialog);
                    this._oDialog.open();
                }.bind(this));
            } else {
                this._oDialog.open();
            }
        }
    });
});
