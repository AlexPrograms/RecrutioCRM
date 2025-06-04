from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_candidate_company_housingstatus_jobtype_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='user',
            table='core_user',
        ),
    ]
