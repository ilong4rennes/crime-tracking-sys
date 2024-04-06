class CrimeInvestigationsController < ApplicationController
    before_action :set_crime_investigation, only: [:destroy]
  
    def new
      @crime_investigation = CrimeInvestigation.new
      @investigation = Investigation.find(params[:investigation_id])
      @crimes_list = Crime.all - @investigation.crimes
    end
  
    def create
      @crime_investigation = CrimeInvestigation.new(crime_investigation_params)
      if @crime_investigation.save
        flash[:notice] = "Successfully added #{@crime_investigation.crime.name} to #{@crime_investigation.investigation.title}."
        redirect_to investigation_path(@crime_investigation.investigation)
      else
        render :new
      end
    end
  
    def destroy
      investigation = @crime_investigation.investigation
      if @crime_investigation.destroy
        flash[:notice] = "Successfully removed a crime from this investigation."
        redirect_to investigation_path(investigation)
      else
        # redirect_to investigation_path(investigation), alert: "Failed to remove the crime."
      end
    end
  
    private
  
    def set_crime_investigation
      @crime_investigation = CrimeInvestigation.find(params[:id])
    end
  
    def crime_investigation_params
      params.require(:crime_investigation).permit(:crime_id, :investigation_id)
    end
  end
  