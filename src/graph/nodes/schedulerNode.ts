import { AppointmentService } from '../../services/appointmentService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

const ScheduleRequiredFieldSchema = z.object({
  professionalId: z.number({ required_error: 'Professional ID is required' }),
  datetime: z.string({ required_error: 'Datetime is required' }),
  patientName: z.string({ required_error: 'Patient name is required' }),
});

export function createSchedulerNode(appointmentService: AppointmentService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`📅 Scheduling appointment...`);

    try {
      const validatedData = ScheduleRequiredFieldSchema.safeParse(state);
      if (!validatedData.success) {
        const errorMessages = validatedData.error.errors.map(err => err.message).join(', ');
        console.log(`Validation failed: ${errorMessages}`);
        return {
          actionSuccess: false,
          actionError: `Validation failed: ${errorMessages}`,
        };
      }

      const appointment = appointmentService.bookAppointment(
        validatedData.data.professionalId,
        new Date(validatedData.data.datetime),
        validatedData.data.patientName,
        state.reason ?? 'General Consultation'
      );
      // In case you want to simulate a second appointment booking, you can uncomment the following lines.
      // const appointment2 = appointmentService.bookAppointment(
      //   validatedData.data.professionalId,
      //   new Date(validatedData.data.datetime),
      //   validatedData.data.patientName,
      //   state.reason ?? 'General Consultation'
      // );      
      console.log(`✅ Appointment scheduled successfully`);

      return {
        ...state,
        actionSuccess: true,
        appointmentData: appointment,
      };
    } catch (error) {
      console.log(`❌ Scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        ...state,
        actionSuccess: false,
        actionError: error instanceof Error ? error.message : 'Scheduling failed',
      };
    }
  };
}
