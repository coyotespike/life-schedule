import { Repository, DataSource } from "typeorm";
import { Contact } from "../entities/Contact";

export class ContactService {
  private contactRepository: Repository<Contact>;

  constructor(dataSource: DataSource) {
    this.contactRepository = dataSource.getRepository(Contact);
  }

  async create(contactData: Partial<Contact>): Promise<Contact> {
    const contact = this.contactRepository.create(contactData);
    return await this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find();
  }

  async findByUserId(userId: number): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { userId },
    });
  }

  async findById(id: number): Promise<Contact | null> {
    return await this.contactRepository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    contactData: Partial<Contact>,
  ): Promise<Contact | null> {
    await this.contactRepository.update(id, contactData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.contactRepository.delete(id);
    return result.affected !== 0;
  }

  async findByEmail(email: string): Promise<Contact | null> {
    return await this.contactRepository.findOne({
      where: { email },
    });
  }

  async findByName(firstName: string, lastName?: string): Promise<Contact[]> {
    const whereCondition: { firstName: string; lastName?: string } = {
      firstName,
    };
    if (lastName) {
      whereCondition.lastName = lastName;
    }

    return await this.contactRepository.find({
      where: whereCondition,
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<Contact | null> {
    return await this.contactRepository.findOne({
      where: { phoneNumber },
    });
  }

  async findContactsWithUpcomingBirthdays(
    userId: number,
    daysAhead: number = 30
  ): Promise<Contact[]> {
    const allContacts = await this.findByUserId(userId);
    const today = new Date();
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysAhead);
    // Set time to end of day to include the full target day
    targetDate.setHours(23, 59, 59, 999);

    return allContacts
      .filter((contact) => {
        if (!contact.birthMonth || !contact.birthDay) {
          return false;
        }

        const thisYear = today.getFullYear();
        let contactBirthday = new Date(
          thisYear,
          contact.birthMonth - 1,
          contact.birthDay
        );
        contactBirthday.setHours(0, 0, 0, 0);

        // If birthday already passed this year, check next year
        if (contactBirthday < today) {
          contactBirthday = new Date(
            thisYear + 1,
            contact.birthMonth - 1,
            contact.birthDay
          );
          contactBirthday.setHours(0, 0, 0, 0);
        }

        // Check if birthday falls within the range
        return contactBirthday >= today && contactBirthday <= targetDate;
      })
      .sort((a, b) => {
        // Sort by upcoming birthday date
        const today = new Date();
        const thisYear = today.getFullYear();
        
        const getBirthdayDate = (contact: Contact) => {
          let date = new Date(thisYear, contact.birthMonth! - 1, contact.birthDay!);
          if (date < today) {
            date = new Date(thisYear + 1, contact.birthMonth! - 1, contact.birthDay!);
          }
          return date.getTime();
        };

        return getBirthdayDate(a) - getBirthdayDate(b);
      });
  }
}
